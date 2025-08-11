import jenkins.model.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.plugins.credentials.impl.*
import com.cloudbees.plugins.credentials.CredentialsScope
import hudson.util.Secret

def instance = Jenkins.getInstance()
def domain = Domain.global()
def credsStore = instance.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()

// Replace or create username/password credential
def upsertUsernamePassword(id, username, password, description) {
    def existing = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class,
        instance,
        null,
        null
    ).find { it.id == id }

    if (existing != null) {
        println("⚠️ Credential ID '${id}' already exists, replacing the existing creds")
        credsStore.removeCredentials(domain, existing)
    }

    def newCreds = new UsernamePasswordCredentialsImpl(
        CredentialsScope.GLOBAL,
        id,
        description,
        username,
        password
    )
    credsStore.addCredentials(domain, newCreds)
    println("✅ Credential '${id}' created or updated successfully")
}

// Replace or create secret text credential
def upsertSecretText(id, secret, description) {
    def existing = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.plugins.credentials.impl.StringCredentials.class,
        instance,
        null,
        null
    ).find { it.id == id }

    if (existing != null) {
        println("⚠️ Credential ID '${id}' already exists, replacing the existing creds")
        credsStore.removeCredentials(domain, existing)
    }

    def newCreds = new StringCredentialsImpl(
        CredentialsScope.GLOBAL,
        id,
        description,
        Secret.fromString(secret)
    )
    credsStore.addCredentials(domain, newCreds)
    println("✅ Credential '${id}' created or updated successfully")
}

// Example usage (replace with your real values)
upsertUsernamePassword("docker-hub-creds", "your-dockerhub-username", "your-dockerhub-password", "Docker Hub Credentials")
upsertSecretText("github-token", "your-github-personal-access-token", "GitHub Personal Access Token")

instance.save()
