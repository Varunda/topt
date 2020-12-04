import { Report } from "tcore";
import { ApiResponse } from "tcore";
import * as axios from "axios";

/**
 * Helper class for generating personal reports
 */
export class PersonalReportGenerator {

    /**
     * Return a string containing the HTML of a player report
     * 
     * @param html      HTML template the report will be generated from
     * @param report    Report to be put into the template
     */
    public static generate(html: string, report: Report): string {
        let anyReport: any = {...report};
        anyReport.stats = Array.from(report.stats.entries());

        const personalReport = html.replace("REPORT_HERE_REPLACE_ME", JSON.stringify(anyReport));

        return personalReport;
    }

    /**
     * Get an ApiResponse that will contain the HTML template when resolved OK
     */
    public static getTemplate(): ApiResponse<string> {
        const page: ApiResponse<string> = new ApiResponse(
            axios.default.get(`./personal/index.html?q=${new Date().getTime()}`),
            (iter: any) => iter as string
        );
        return page;
    }

}