import pandas as pd
import matplotlib.pyplot as plt

def plot_approval_failure_rate_vs_delay(file_path):
    df = pd.read_excel(file_path)
    df['Primary Completion Date'] = pd.to_datetime(df['Primary Completion Date'], errors='coerce')
    df['Completion Date'] = pd.to_datetime(df['Completion Date'], errors='coerce')
    df['Completion_Delay_Days'] = (df['Completion Date'] - df['Primary Completion Date']).dt.days
    df['Result'] = df['Outcome'].apply(lambda x: 1 if x == 'Failed' else 0)
    df = df.dropna(subset=['Completion_Delay_Days', 'Result'])
    approval_failure_rate = df.groupby('Completion_Delay_Days')['Result'].value_counts(normalize=True).unstack(fill_value=0)
    approval_failure_rate.plot(kind='bar', stacked=True, figsize=(10,6), color=['blue', 'red'])
    
    plt.title('Approval and Failure Rate vs Completion Delay Days')
    plt.xlabel('Completion Delay (Days)')
    plt.ylabel('Percentage')
    plt.xticks(rotation=45)
    plt.legend(['Approved', 'Failed'], loc='upper right')
    plt.tight_layout()
    plt.show()

file_path = 'Train test Data/Train_clinical_trials_data.xlsx'  
plot_approval_failure_rate_vs_delay(file_path)
