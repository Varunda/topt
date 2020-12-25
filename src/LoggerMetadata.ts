
export type LoggerMetadataLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "SILENT";

export class LoggerMetadata {

    public name: string = "";

    public level: LoggerMetadataLevel = "SILENT";
}