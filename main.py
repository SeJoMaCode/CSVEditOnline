
failed = None;
pd.set_option('float_format', '{:.2f}'.format)
csv = [pp.common.comma_separated_list.parseString(row).asList() for row in csv.split('\n')]
df = pd.DataFrame(csv[1:], columns=csv[0])

df.columns = [col[1:-1] for col in df.columns]
for i, col in enumerate(df.columns):
    df.iloc[:, i] = df.iloc[:, i].str.replace('"', '')

try:
    df = df[['Account', 'Num', 'Original Amount', 'Name', 'Date']]
    df.replace({'': None}, inplace=True)
    df = df.dropna()

    df['Account'] = df['Account'].astype(int)
    df['Num'] = df['Num'].astype(int)
    df['Original Amount'] = abs(df['Original Amount'].astype(float))
    print(df)
except Exception as e:
     failed = e