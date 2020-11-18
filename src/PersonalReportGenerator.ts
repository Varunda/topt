import { Report } from "tcore";
import { ApiResponse } from "tcore";

export class PersonalReportGenerator {

    public static generate(html: string, report: Report): string {
        let anyReport: any = {...report};
        anyReport.stats = Array.from(report.stats.entries());

        const personalReport = html.replace("REPORT_HERE_REPLACE_ME", JSON.stringify(anyReport));

        return personalReport;
    }

    public static getTemplate(): ApiResponse<string> {
        const page: ApiResponse<string> = new ApiResponse(
            $.get(`./personal/index.html?q=${new Date().getTime()}`),
            (iter: any) => iter as string
        );
        return page;
    }

}