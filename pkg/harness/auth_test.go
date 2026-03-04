// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package harness

import (
	"os"
	"path/filepath"
	"testing"
)

func TestGatherAuth_EnvVars(t *testing.T) {
	// Set up all env vars
	t.Setenv("GEMINI_API_KEY", "gemini-key")
	t.Setenv("GOOGLE_API_KEY", "google-key")
	t.Setenv("ANTHROPIC_API_KEY", "anthropic-key")
	t.Setenv("OPENAI_API_KEY", "openai-key")
	t.Setenv("CODEX_API_KEY", "codex-key")
	t.Setenv("GOOGLE_CLOUD_PROJECT", "my-project")
	t.Setenv("GOOGLE_CLOUD_REGION", "us-central1")
	t.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "/path/to/creds.json")

	auth := GatherAuth()

	if auth.GeminiAPIKey != "gemini-key" {
		t.Errorf("GeminiAPIKey = %q, want %q", auth.GeminiAPIKey, "gemini-key")
	}
	if auth.GoogleAPIKey != "google-key" {
		t.Errorf("GoogleAPIKey = %q, want %q", auth.GoogleAPIKey, "google-key")
	}
	if auth.AnthropicAPIKey != "anthropic-key" {
		t.Errorf("AnthropicAPIKey = %q, want %q", auth.AnthropicAPIKey, "anthropic-key")
	}
	if auth.OpenAIAPIKey != "openai-key" {
		t.Errorf("OpenAIAPIKey = %q, want %q", auth.OpenAIAPIKey, "openai-key")
	}
	if auth.CodexAPIKey != "codex-key" {
		t.Errorf("CodexAPIKey = %q, want %q", auth.CodexAPIKey, "codex-key")
	}
	if auth.GoogleCloudProject != "my-project" {
		t.Errorf("GoogleCloudProject = %q, want %q", auth.GoogleCloudProject, "my-project")
	}
	if auth.GoogleCloudRegion != "us-central1" {
		t.Errorf("GoogleCloudRegion = %q, want %q", auth.GoogleCloudRegion, "us-central1")
	}
	if auth.GoogleAppCredentials != "/path/to/creds.json" {
		t.Errorf("GoogleAppCredentials = %q, want %q", auth.GoogleAppCredentials, "/path/to/creds.json")
	}
}

func TestGatherAuth_ProjectFallbacks(t *testing.T) {
	// Test GCP_PROJECT fallback
	t.Setenv("GOOGLE_CLOUD_PROJECT", "")
	t.Setenv("GCP_PROJECT", "gcp-proj")
	t.Setenv("ANTHROPIC_VERTEX_PROJECT_ID", "")

	auth := GatherAuth()
	if auth.GoogleCloudProject != "gcp-proj" {
		t.Errorf("GoogleCloudProject = %q, want %q (GCP_PROJECT fallback)", auth.GoogleCloudProject, "gcp-proj")
	}

	// Test ANTHROPIC_VERTEX_PROJECT_ID fallback
	t.Setenv("GCP_PROJECT", "")
	t.Setenv("ANTHROPIC_VERTEX_PROJECT_ID", "vertex-proj")

	auth = GatherAuth()
	if auth.GoogleCloudProject != "vertex-proj" {
		t.Errorf("GoogleCloudProject = %q, want %q (ANTHROPIC_VERTEX_PROJECT_ID fallback)", auth.GoogleCloudProject, "vertex-proj")
	}
}

func TestGatherAuth_RegionFallbacks(t *testing.T) {
	// Test CLOUD_ML_REGION fallback
	t.Setenv("GOOGLE_CLOUD_REGION", "")
	t.Setenv("CLOUD_ML_REGION", "ml-region")
	t.Setenv("GOOGLE_CLOUD_LOCATION", "")

	auth := GatherAuth()
	if auth.GoogleCloudRegion != "ml-region" {
		t.Errorf("GoogleCloudRegion = %q, want %q (CLOUD_ML_REGION fallback)", auth.GoogleCloudRegion, "ml-region")
	}

	// Test GOOGLE_CLOUD_LOCATION fallback
	t.Setenv("CLOUD_ML_REGION", "")
	t.Setenv("GOOGLE_CLOUD_LOCATION", "location")

	auth = GatherAuth()
	if auth.GoogleCloudRegion != "location" {
		t.Errorf("GoogleCloudRegion = %q, want %q (GOOGLE_CLOUD_LOCATION fallback)", auth.GoogleCloudRegion, "location")
	}
}

func TestGatherAuth_FileDiscovery(t *testing.T) {
	tmpHome := t.TempDir()
	t.Setenv("HOME", tmpHome)

	// Clear env vars that would take precedence
	t.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "")
	t.Setenv("GEMINI_API_KEY", "")
	t.Setenv("GOOGLE_API_KEY", "")
	t.Setenv("ANTHROPIC_API_KEY", "")
	t.Setenv("OPENAI_API_KEY", "")
	t.Setenv("CODEX_API_KEY", "")
	t.Setenv("GOOGLE_CLOUD_PROJECT", "")
	t.Setenv("GCP_PROJECT", "")
	t.Setenv("ANTHROPIC_VERTEX_PROJECT_ID", "")
	t.Setenv("GOOGLE_CLOUD_REGION", "")
	t.Setenv("CLOUD_ML_REGION", "")
	t.Setenv("GOOGLE_CLOUD_LOCATION", "")

	// Create well-known credential files
	adcPath := filepath.Join(tmpHome, ".config", "gcloud", "application_default_credentials.json")
	os.MkdirAll(filepath.Dir(adcPath), 0755)
	os.WriteFile(adcPath, []byte(`{"type":"authorized_user"}`), 0644)

	oauthPath := filepath.Join(tmpHome, ".gemini", "oauth_creds.json")
	os.MkdirAll(filepath.Dir(oauthPath), 0755)
	os.WriteFile(oauthPath, []byte(`{"dummy":"oauth"}`), 0644)

	codexPath := filepath.Join(tmpHome, ".codex", "auth.json")
	os.MkdirAll(filepath.Dir(codexPath), 0755)
	os.WriteFile(codexPath, []byte(`{"dummy":"codex"}`), 0644)

	opencodePath := filepath.Join(tmpHome, ".local", "share", "opencode", "auth.json")
	os.MkdirAll(filepath.Dir(opencodePath), 0755)
	os.WriteFile(opencodePath, []byte(`{"dummy":"opencode"}`), 0644)

	auth := GatherAuth()

	if auth.GoogleAppCredentials != adcPath {
		t.Errorf("GoogleAppCredentials = %q, want %q", auth.GoogleAppCredentials, adcPath)
	}
	if auth.OAuthCreds != oauthPath {
		t.Errorf("OAuthCreds = %q, want %q", auth.OAuthCreds, oauthPath)
	}
	if auth.CodexAuthFile != codexPath {
		t.Errorf("CodexAuthFile = %q, want %q", auth.CodexAuthFile, codexPath)
	}
	if auth.OpenCodeAuthFile != opencodePath {
		t.Errorf("OpenCodeAuthFile = %q, want %q", auth.OpenCodeAuthFile, opencodePath)
	}
}

func TestGatherAuth_EnvCredsTakePrecedenceOverFiles(t *testing.T) {
	tmpHome := t.TempDir()
	t.Setenv("HOME", tmpHome)

	// Create the ADC file
	adcPath := filepath.Join(tmpHome, ".config", "gcloud", "application_default_credentials.json")
	os.MkdirAll(filepath.Dir(adcPath), 0755)
	os.WriteFile(adcPath, []byte(`{"type":"authorized_user"}`), 0644)

	// Set env var — should take precedence over file discovery
	t.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "/explicit/path/creds.json")

	auth := GatherAuth()
	if auth.GoogleAppCredentials != "/explicit/path/creds.json" {
		t.Errorf("GoogleAppCredentials = %q, want env value %q", auth.GoogleAppCredentials, "/explicit/path/creds.json")
	}
}

func TestGatherAuth_NoFiles(t *testing.T) {
	tmpHome := t.TempDir()
	t.Setenv("HOME", tmpHome)

	// Clear all env vars
	t.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "")
	t.Setenv("GEMINI_API_KEY", "")
	t.Setenv("GOOGLE_API_KEY", "")
	t.Setenv("ANTHROPIC_API_KEY", "")
	t.Setenv("OPENAI_API_KEY", "")
	t.Setenv("CODEX_API_KEY", "")
	t.Setenv("GOOGLE_CLOUD_PROJECT", "")
	t.Setenv("GCP_PROJECT", "")
	t.Setenv("ANTHROPIC_VERTEX_PROJECT_ID", "")
	t.Setenv("GOOGLE_CLOUD_REGION", "")
	t.Setenv("CLOUD_ML_REGION", "")
	t.Setenv("GOOGLE_CLOUD_LOCATION", "")

	auth := GatherAuth()

	if auth.GoogleAppCredentials != "" {
		t.Errorf("GoogleAppCredentials = %q, want empty", auth.GoogleAppCredentials)
	}
	if auth.OAuthCreds != "" {
		t.Errorf("OAuthCreds = %q, want empty", auth.OAuthCreds)
	}
	if auth.CodexAuthFile != "" {
		t.Errorf("CodexAuthFile = %q, want empty", auth.CodexAuthFile)
	}
	if auth.OpenCodeAuthFile != "" {
		t.Errorf("OpenCodeAuthFile = %q, want empty", auth.OpenCodeAuthFile)
	}
}
