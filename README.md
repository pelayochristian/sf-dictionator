# Salesforce Data Dictionary Generator

## 👋 Introduction

A Web-Based tool for generating Salesforce Data Dictionary supported with Oath2 Salesforce Authentication. This tool will help Salesforce Developer/Administrator to visualize their Schema Object field's pre-selected important attributes rather than visiting Salesforce Object Manager. It can export multiple schema objects to excel with fancy cell color and a Datatable for viewing the selected Schema Object.

## ⚡️ One-click Deployment to your own Vercel Account

Using the Vercel Deploy Button, you can quickly deploy this project into your own Vercel Account.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpelayochristian%2Fsalesforce-next-auth&env=SALESFORCE_URL_LOGIN,NEXTAUTH_SECRET,SALESFORCE_CLIENT_SECRET,SALESFORCE_CLIENT_ID&envDescription=Environment%20Variables%20needed%20to%20run%20this%20project.&envLink=https%3A%2F%2Fgithub.com%2Fpelayochristian%2Fsalesforce-next-auth%23environment-variables&project-name=salesforce-next-auth&repo-name=salesforce-next-auth)

After clicking the Deploy button above, it will redirect to your Vercel Account, you'll see similar to the following screen shot bellow.

1. Vercel will ask you to link your [Github](https://github.com), [Gitlab](https://about.gitlab.com/) or [Bitbucket](https://bitbucket.org/product). In this demo it uses Github, then populate the **Repository Name** and click **Create**.
   ![Alt text](github-images/vercel_create_repo.png?raw=true "Vercel Create Repo")

2. Next, it will proceed on setting up the **[Environment Variables](https://github.com/pelayochristian/salesforce-next-auth#environment-variables)** needed to this project to run smoothly, then click **Deploy**
   ![Alt text](github-images/vercel_add_env_var.png?raw=true "Vercel Add Environment Variables")

## 🧑‍🔧 Pre-Work

### Create Connected App in Salesforce

1. Log in to Salesforce as an administrator.
2. In the drop-down list of the account (in the upper-right corner), select **Setup**.
3. In the left-hand pane, go to **App Setup > Create >Apps**.
4. In the **Connected Apps** pane, click the **New** button.
5. On the **New Connected App** page, fill the following required fields under **Basic Information**:
    - **Connected App Name**. For example, NextAuth Demo.
    - **API name**. For example, NextAuth Demo.
    - **Contact Email**.
6. Go to **API (Enable OAuth Settings)**, and select **Enable OAuth Settings**.

    - In the **Callback URL** field, enter `http://localhost:3000/api/auth/callback/salesforce` and `https://YOUR_VERCEL_APP_URL/api/auth/callback/salesforce`.
    - In the **Selected OAuth Scopes** field, for this demo I added all available scope. In your end you can only select **Access and manage your data (api)**, and then click **Add**.

        ![Alt text](github-images/enable_oath_settings_config.png?raw=true "Title")

7. Click the **Save** button to save the new Connected App.
8. In the **Connected Apps** list, find the App that you just created, and then click **Manage**.
    - On the page that opens, click the **Edit** button.
    - Under **OAuth policies**, select **All users may self-authorize** in the **Permitted Users** list, and then click the **Save** button.
9. Go back to the **Connected Apps** list, and click the App that you just created.
10. Go to **API (Enable OAuth Settings)**, and note down the **Consumer Key** and **Consumer Secret**, which will be used for the configuration of **Environment Variables**.

### Environment Variables

For local installation, create `.env.local` in root folder of the project.

```env
SALESFORCE_CLIENT_ID=YOUR_CLIENT_KEY
SALESFORCE_CLIENT_SECRET=YOUR_SECRET_KEY
SALESFORCE_URL_LOGIN=https://login.salesforce.com

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
```

To generate NextAuth Secret you can use this app: https://generate-secret.vercel.app/32

## ⚡️ Local Machine Installation
