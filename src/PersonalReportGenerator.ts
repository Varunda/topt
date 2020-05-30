import { Report } from "InvididualGenerator";

export class PersonalReportGenerator {

    public static generate(html: string, report: Report): string {
        let anyReport: any = {...report};
        anyReport.stats = Array.from(report.stats.entries());

        const personalReport = html.replace("REPORT_HERE_REPLACE_ME", JSON.stringify(anyReport));

        return personalReport;
    }

}