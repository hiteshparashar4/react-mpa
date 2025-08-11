import jenkins.model.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.plugins.credentials.impl.*
import com.cloudbees.plugins.credentials.CredentialsScope
import hudson.util.Secret
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.*

def instance = Jenkins.getInstance()

// === CONFIG - replace with env vars or params if you want ===
def dockerHubUsername = "your-dockerhub-username"
def dockerHubPassword = "your-dockerhub-password"
def githubToken = "your-github-personal-access-token"
def gitRepoUrl = "https://github.com/your-org/your-react-mpa-app.git"
def gitBranch = "main"
def pipelineJobName = "react-mpa-pipeline"
def dockerCredsId = "docker-hub-creds"
def githubCredsId = "github-token"

def domain = Domain.global()
def credsStore = instance.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()

// Function to add or update username/password creds
def upsertUsernamePassword(id, username, password, description) {
    def existing = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials.class,
        instance,
        null,
        null
    ).find { it.id == id }
    if (existing == null) {
        def newCreds = new UsernamePasswordCredentialsImpl(
            CredentialsScope.GLOBAL, id, description, username, password)
        credsStore.addCredentials(domain, newCreds)
        println("✅ Created credentials '${id}'")
    } else if (existing.username != username || existing.password.getPlainText() != password) {
        credsStore.removeCredentials(domain, existing)
        def newCreds = new UsernamePasswordCredentialsImpl(
            CredentialsScope.GLOBAL, id, description, username, password)
        credsStore.addCredentials(domain, newCreds)
        println("🔄 Updated credentials '${id}'")
    } else {
        println("⚠️ Credentials '${id}' already exist and are up-to-date")
    }
}

// Function to add or update secret text creds
def upsertSecretText(id, secret, description) {
    def existing = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.plugins.credentials.impl.StringCredentials.class,
        instance,
        null,
        null
    ).find { it.id == id }
    if (existing == null) {
        def newCreds = new StringCredentialsImpl(
            CredentialsScope.GLOBAL, id, description, Secret.fromString(secret))
        credsStore.addCredentials(domain, newCreds)
        println("✅ Created secret text credentials '${id}'")
    } else if (existing.secret.getPlainText() != secret) {
        credsStore.removeCredentials(domain, existing)
        def newCreds = new StringCredentialsImpl(
            CredentialsScope.GLOBAL, id, description, Secret.fromString(secret))
        credsStore.addCredentials(domain, newCreds)
        println("🔄 Updated secret text credentials '${id}'")
    } else {
        println("⚠️ Secret text credentials '${id}' already exist and are up-to-date")
    }
}

upsertUsernamePassword(dockerCredsId, dockerHubUsername, dockerHubPassword, "Docker Hub Credentials")
upsertSecretText(githubCredsId, githubToken, "GitHub Personal Access Token")

// Create or update pipeline job
def job = instance.getItem(pipelineJobName)

def scm = new GitSCM(
    [new UserRemoteConfig(gitRepoUrl, null, null, githubCredsId)],
    [new BranchSpec(gitBranch)],
    false,
    Collections.emptyList(),
    null,
    null,
    Collections.emptyList()
)

def flowDefinition = new CpsScmFlowDefinition(scm, "Jenkinsfile")

if (job == null) {
    println("🚀 Creating pipeline job: ${pipelineJobName}")
    WorkflowJob pipelineJob = instance.createProject(WorkflowJob.class, pipelineJobName)
    pipelineJob.setDefinition(flowDefinition)
    pipelineJob.save()
    println("✅ Pipeline job created")
} else {
    println("🔄 Updating existing pipeline job: ${pipelineJobName}")
    job.setDefinition(flowDefinition)
    job.save()
    println("✅ Pipeline job updated")
}

instance.save()
