{{- define "cours.name" -}}
{{ .Chart.Name }}
{{- end }}

{{- define "cours.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}
