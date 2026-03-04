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

	"github.com/ptone/scion-agent/pkg/api"
	"github.com/ptone/scion-agent/pkg/util"
)

// GatherAuth populates an AuthConfig from the environment and filesystem.
// It is source-agnostic: it checks env vars and well-known file paths
// without knowing which harness will consume the result.
func GatherAuth() api.AuthConfig {
	home, _ := os.UserHomeDir()

	auth := api.AuthConfig{
		// Env-var sourced fields
		GeminiAPIKey:    os.Getenv("GEMINI_API_KEY"),
		GoogleAPIKey:    os.Getenv("GOOGLE_API_KEY"),
		AnthropicAPIKey: os.Getenv("ANTHROPIC_API_KEY"),
		OpenAIAPIKey:    os.Getenv("OPENAI_API_KEY"),
		CodexAPIKey:     os.Getenv("CODEX_API_KEY"),
		GoogleCloudProject: util.FirstNonEmpty(
			os.Getenv("GOOGLE_CLOUD_PROJECT"),
			os.Getenv("GCP_PROJECT"),
			os.Getenv("ANTHROPIC_VERTEX_PROJECT_ID"),
		),
		GoogleCloudRegion: util.FirstNonEmpty(
			os.Getenv("GOOGLE_CLOUD_REGION"),
			os.Getenv("CLOUD_ML_REGION"),
			os.Getenv("GOOGLE_CLOUD_LOCATION"),
		),
		GoogleAppCredentials: os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"),
	}

	// File-sourced fields: check well-known paths
	if auth.GoogleAppCredentials == "" && home != "" {
		adcPath := filepath.Join(home, ".config", "gcloud", "application_default_credentials.json")
		if _, err := os.Stat(adcPath); err == nil {
			auth.GoogleAppCredentials = adcPath
		}
	}

	if home != "" {
		oauthPath := filepath.Join(home, ".gemini", "oauth_creds.json")
		if _, err := os.Stat(oauthPath); err == nil {
			auth.OAuthCreds = oauthPath
		}

		codexPath := filepath.Join(home, ".codex", "auth.json")
		if _, err := os.Stat(codexPath); err == nil {
			auth.CodexAuthFile = codexPath
		}

		opencodePath := filepath.Join(home, ".local", "share", "opencode", "auth.json")
		if _, err := os.Stat(opencodePath); err == nil {
			auth.OpenCodeAuthFile = opencodePath
		}
	}

	return auth
}
