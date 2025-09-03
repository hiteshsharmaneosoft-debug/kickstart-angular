step1: Logged into Azure CLI
  az login
  az account set --subscription <YOUR_SUBSCRIPTION_ID>

step2: A Storage Account (kind = StorageV2)
  # Variables
    RG= resource group name
    LOCATION=eastus
    SA_NAME= storage account name

    az group create -n $RG -l $LOCATION

    az storage account create \
      -n $SA_NAME \
      -g $RG \
      -l $LOCATION \
      --sku Standard_LRS \
      --kind StorageV2

step3: Create App Registration for GitHub OIDC
  # Variables
  APP_NAME="github-oidc-angular"
  SUBSCRIPTION_ID= 

  # Create app registration
  APP_ID= $(az ad app create --display-name $APP_NAME --query appId -o tsv)

  # Create a service principal for the app
  SP_ID= $(az ad sp create --id $APP_ID --query id -o tsv)

  echo "App ID (client-id): $APP_ID"
  echo "SP Object ID: $SP_ID"

step4: Assign Role to the App
  # Scope = Storage Account
  SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Storage/storageAccounts/$SA_NAME"

  az role assignment create \
    --assignee-object-id $SP_ID \
    --assignee-principal-type ServicePrincipal \
    --role "Storage Blob Data Contributor" \
    --scope $SCOPE

step5: Add GitHub Secrets & Variables
  Secrets:
    AZURE_CLIENT_ID = output of $APP_ID
    AZURE_TENANT_ID = output of $TENANT_ID
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