step1: Logged into Azure CLI
  az login
  az account set --subscription <YOUR_SUBSCRIPTION_ID>
      az account set --subscription 3b4e4363-b5f5-4d3e-a287-d56c6668229f

step2: A Storage Account (kind = StorageV2)
  # Variables
    RG= resource group name 
    LOCATION=centralus
    SA_NAME= storage account name

    az group create -n $RG -l $LOCATION  
        az group create --name rg-neo-cus-test --location centralus

    az storage account create \
      -n $SA_NAME \
      -g $RG \
      -l $LOCATION \
      --sku Standard_LRS \
      --kind StorageV2   
      
          az storage account create --name stneocustest --resource-group rg-neo-cus-test --location centralus --sku Standard_LRS --kind StorageV2


step3: Create App Registration for GitHub OIDC
  # Variables
  APP_NAME="github-oidc-angular"

  # Create app registration
  APP_ID= $(az ad app create --display-name github-oidc-angular --query appId -o tsv)
     appId : ad77e9f4-0790-4ff1-abbe-9d48692a5a2d

  # Create a service principal for the app
  SP_ID= $(az ad sp create --id ad77e9f4-0790-4ff1-abbe-9d48692a5a2d --query id -o tsv)
      spId: 3ce01e6e-a0c1-41ba-96a1-2f21bf8fe49b


step4: Assign Role to the App
  # Scope = Storage Account
  SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Storage/storageAccounts/$SA_NAME"

    Scope: /subscriptions/3b4e4363-b5f5-4d3e-a287-d56c6668229f/resourceGroups/rg-neo-cus-test/providers/Microsoft.Storage/storageAccounts/stneocustest

  az role assignment create \
    --assignee-object-id $SP_ID \
    --assignee-principal-type ServicePrincipal \
    --role "Storage Blob Data Contributor" \
    --scope $SCOPE  
    
    -> az role assignment create --assignee-object-id 3ce01e6e-a0c1-41ba-96a1-2f21bf8fe49b --assignee-principal-type ServicePrincipal --role "Storage Blob Data Contributor" --scope "/subscriptions/3b4e4363-b5f5-4d3e-a287-d56c6668229f/resourceGroups/rg-neo-cus-test/providers/Microsoft.Storage/storageAccounts/stneocustest"


    az ad app federated-credential create \
  --id $APP_ID \
  --parameters "$FED_CREDS"


        az ad app federated-credential create --id ad77e9f4-0790-4ff1-abbe-9d48692a5a2d --parameters '{\"name\": \"github-oidc\", \"issuer\": \"https://token.actions.githubusercontent.com\", \"subject\": \"repo:hiteshsharmaneosoft-debug/kickstart-angular:ref:refs/heads/master\", \"description\": \"OIDC connection for GitHub Actions\", \"audiences\": [\"api://AzureADTokenExchange\"]}'


step5: Add GitHub Secrets & Variables
  Secrets:
    AZURE_CLIENT_ID = output of $APP_ID
    AZURE_TENANT_ID = output of $TENANT_ID -> 29173cc3-177c-4ce0-aacc-2c408811558f
    AZURE_SUBSCRIPTION_ID = your subscription

  Variables:
    AZURE_STORAGE_ACCOUNT = $SA_NAME

step6: Test It
  Commit → push to branch.
  GitHub Action runs:
    Builds Angular
    Logs into Azure via OIDC
    Uploads to $web container
  Your SPA is live at: