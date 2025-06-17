import pandas as pd


input_file = 'Train test Data/Train_clinical_trials_data.xlsx'
output_file = 'Processed data/Processed_Train_clinical_trials_data.xlsx'

def process_clinical_trials(file_path, output_path):
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

    columns_to_drop = [
        'Study Title', 'Brief Summary', 'Primary Outcome Measures',
        'Secondary Outcome Measures', 'Other Outcome Measures',
        'Sex', 'Age', 'Phases', 'Study Documents', 'Collaborators',
        'Acronym', 'Results First Posted', 'STUDY URL', 'Study Type',
    ]
    df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])

    selected_cols = [
        'NCT Number', 'Outcome', 'Study_Status', 'Conditions', 'Interventions', 'Sponsor',
        'Enrollment', 'Funder Type', 'Study Design',
        'Has_Results', 'Results_Delay_Days', 'Study_Context', 'Outcome_Details'
    ]
    df_final = df[selected_cols]
    df_final.to_excel(output_path, index=False)

    print(f"Processed file saved at: {output_path}")

if __name__ == "__main__":
    process_clinical_trials(input_file, output_file)
