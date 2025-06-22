import pandas as pd
from datetime import datetime
import ast
from collections import defaultdict

# Define the input and output file paths
input_file = 'Train test Data/Train_clinical_trials_data.xlsx'
output_file = 'Processed data/Processed_Train_clinical_trials_data.xlsx'

# Define the date formats to try when parsing dates
formats = [
    "%Y-%m-%d", "%d/%m/%Y %H:%M:%S", "%B %d, %Y",
    "%Y.%m.%d AD at %H:%M:%S", "%d-%b-%Y", "%Y/%m/%d %H:%M", "%d/%m/%Y"
]

def parse_mixed_date(date_str):
    """Parses a date string with multiple possible formats."""
    if pd.isna(date_str):
        return pd.NaT
    date_str = str(date_str)
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return pd.NaT

def get_study_design_cols(study_design_series):
    """Parses the 'Study Design' Series into a DataFrame of new columns."""
    print("Processing Study Design column...")
    def parse_design(design_str):
        try:
            return ast.literal_eval(str(design_str))
        except (ValueError, SyntaxError):
            return {}

    study_design_dicts = study_design_series.apply(parse_design)
    return pd.DataFrame(study_design_dicts.tolist())

def get_intervention_cols(interventions_series):
    """Parses the 'Interventions' Series into a DataFrame of new columns."""
    print("Processing Interventions column...")
    def parse_interventions(interventions_str):
        interventions_by_type = defaultdict(list)
        if pd.isna(interventions_str):
            return interventions_by_type
        interventions = str(interventions_str).split('|')
        for intervention in interventions:
            if ':' in intervention:
                key, value = intervention.split(':', 1)
                interventions_by_type[key.strip().replace(" ", "_")].append(value.strip())
        return interventions_by_type

    processed_interventions = interventions_series.apply(parse_interventions)
    all_intervention_types = set(key for d in processed_interventions for key in d.keys())
    
    interventions_df = pd.DataFrame()
    for intervention_type in sorted(list(all_intervention_types)): # Sorted for consistent order
        max_count = processed_interventions.apply(lambda x: len(x.get(intervention_type, []))).max()
        for i in range(max_count):
            col_name = f'{intervention_type}_{i+1}'
            interventions_df[col_name] = processed_interventions.apply(
                lambda x: x.get(intervention_type, [])[i] if len(x.get(intervention_type, [])) > i else None
            )
    return interventions_df
def drop_high_null_columns(df, threshold=1):

    """

    Drops columns from a DataFrame that have a percentage of null values

    exceeding a specified threshold.

    """

    null_percentages = df.isnull().sum() / len(df)

    cols_to_drop = null_percentages[null_percentages > threshold].index.tolist()

    if cols_to_drop:

        print(f"Dropping columns with >{threshold*100:.0f}% nulls: {cols_to_drop}")

        df = df.drop(columns=cols_to_drop)

    else:

        print("No columns exceeded the null value threshold.")

    return df

def process_clinical_trials(file_path, output_path):
    """
    Main function to run the full clinical trials data processing pipeline,
    keeping original columns in order and appending new columns at the end.
    """
    print("Starting clinical trials data processing...")
    df = pd.read_excel(file_path)

    # === Process complex columns into separate DataFrames ===
    study_design_df = get_study_design_cols(df['Study Design'])
    interventions_df = get_intervention_cols(df['Interventions'])

    # === Original Feature Engineering from your script ===
    print("Performing feature engineering...")
    df['Study_Context'] = df['Study Title'].fillna('') + " " + df['Brief Summary'].fillna('')
    df['Outcome_Details'] = (
        df['Primary Outcome Measures'].fillna('') + " " +
        df['Secondary Outcome Measures'].fillna('') + " " +
        df['Other Outcome Measures'].fillna('')
    )
    df['Has_Results'] = df['Results First Posted'].notnull().astype(int)
    df['Start Date'] = df['Start Date'].apply(parse_mixed_date)
    df['Results First Posted Date'] = df['Results First Posted'].apply(parse_mixed_date)
    df['Results_Delay_Days'] = (df['Results First Posted Date'] - df['Start Date']).dt.days.fillna(-1)
    df = df.rename(columns={'Study Status': 'Study_Status'})
    df['Low_Enrollment'] = (df['Enrollment'].fillna(0) < 200).astype(int)
    df['Outcome_numeric'] = df['Outcome'].apply(lambda x: 1 if x == 'Failed' else 0)
    df['Suspended_Terminated'] = df['Study_Status'].apply(lambda x: 1 if x in ['SUSPENDED', 'TERMINATED'] else 0)
    
    # === Drop redundant columns using your original list ===
    columns_to_drop = [
        'Study Title', 'Brief Summary', 'Primary Outcome Measures',
        'Secondary Outcome Measures', 'Other Outcome Measures', 'Sex', 'Study_Status',
        'Age', 'Phases', 'Study Documents', 'Collaborators', 'Acronym',
        'Results First Posted', 'STUDY URL', 'Study Type',
        'Start Date', 'Results First Posted Date' 
    ]
    df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])
    
    # === Select the base columns in the desired order ===
    base_columns = [
        'NCT Number', 'Outcome', 'Outcome_numeric', 'Has_Results', 'Low_Enrollment',
        'Results_Delay_Days', 'Suspended_Terminated', 'Conditions','Study_Context', 'Outcome_Details', 'Sponsor', 'Funder Type'
    ]
    df_base = df[[col for col in base_columns if col in df.columns]]
    
    # === Concatenate the base DataFrame with the new processed columns ===
    print("Concatenating base data with new columns...")
    df_final = pd.concat([df_base, study_design_df, interventions_df], axis=1)
    # === Drop columns with high null percentage ===
    df_final = drop_high_null_columns(df_final, threshold=0.9)

    # Save the final processed file
    df_final.to_excel(output_path, index=False)
    print(f"\nProcessing complete. Processed file saved at: {output_path}")
    print(f"Final dataset has {df_final.shape[0]} rows and {df_final.shape[1]} columns.")

if __name__ == "__main__":
    process_clinical_trials(input_file, output_file)