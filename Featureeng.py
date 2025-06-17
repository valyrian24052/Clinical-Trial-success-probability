import pandas as pd



input_file = 'Train test Data/Train_clinical_trials_data.xlsx'
output_file = 'Processed data/Processed_Train_clinical_trials_data.xlsx'

def process_clinical_trials(file_path, output_path):
    """
    This function processes the clinical trials dataset by performing the following transformations:
    1. Combines the 'Study Title' and 'Brief Summary' into 'Study_Context'.
    2. Merges 'Primary Outcome Measures', 'Secondary Outcome Measures', and 'Other Outcome Measures' into 'Outcome_Details'.
    3. Creates a binary 'Has_Results' column indicating whether results are posted.
    4. Calculates the 'Results_Delay_Days' based on 'Start Date' and 'Results First Posted' dates.
    5. Converts 'Enrollment' into a binary 'Low_Enrollment' column where 1 indicates enrollment < 200.
    6. Adds a 'Result' column where 1 indicates a Failed outcome, 0 indicates Approved.
    7. Adds a 'Suspended_Terminated' column where 1 indicates suspended or terminated study status, 0 otherwise.
    8. Drops unnecessary or redundant columns.
    9. Outputs the processed dataset to an Excel file.

    Parameters:
    file_path (str): Path to the input Excel file.
    output_path (str): Path to save the processed output Excel file.
    """
    import pandas as pd

    df = pd.read_excel(file_path)
    df['Study_Context'] = df['Study Title'].fillna('') + " " + df['Brief Summary'].fillna('')
    df['Outcome_Details'] = (
        df['Primary Outcome Measures'].fillna('') + " " +
        df['Secondary Outcome Measures'].fillna('') + " " +
        df['Other Outcome Measures'].fillna('')
    )
    df['Has_Results'] = df['Results First Posted'].notnull().astype(int)
    df['Start Date'] = pd.to_datetime(df['Start Date'], errors='coerce')
    df['Results First Posted Date'] = pd.to_datetime(df['Results First Posted'], errors='coerce')
    df['Results_Delay_Days'] = (df['Results First Posted Date'] - df['Start Date']).dt.days.fillna(-1)
    df = df.rename(columns={'Study Status': 'Study_Status'})
    df['Low_Enrollment'] = (df['Enrollment'] < 200).astype(int)
    df['Outcome_numeric'] = df['Outcome'].apply(lambda x: 1 if x == 'Failed' else 0)
    df['Suspended_Terminated'] = df['Study_Status'].apply(lambda x: 1 if x in ['SUSPENDED', 'TERMINATED'] else 0)
    
    columns_to_drop = [
        'Study Title', 'Brief Summary', 'Primary Outcome Measures',
        'Secondary Outcome Measures', 'Other Outcome Measures', 'Sex', 'Study_Status',
        'Age', 'Phases', 'Study Documents', 'Collaborators', 'Acronym', 
        'Results First Posted', 'STUDY URL', 'Study Type', 'Sponsor', 'Enrollment', 'Funder Type'
    ]
    df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])
    
    selected_cols = [
        'NCT Number', 'Outcome', 'Outcome_numeric', 'Has_Results', 'Low_Enrollment','Results_Delay_Days','Suspended_Terminated',
         'Conditions', 'Interventions', 'Study Design', 
        'Study_Context', 'Outcome_Details'
    ]
    df_final = df[selected_cols]
    df_final.to_excel(output_path, index=False)
    print(f"Processed file saved at: {output_path}")



if __name__ == "__main__":
    process_clinical_trials(input_file, output_file)
