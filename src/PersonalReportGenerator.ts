import { Report } from "tcore";
import { ApiResponse } from "tcore";
import * as axios from "axios";
import { ResponseContent } from "../../topt-core/build/core/index";

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
    public static async getTemplate(): Promise<string> {
        const page: ResponseContent<string> = await new ApiResponse(
            axios.default.get(`./personal/index.html?q=${new Date().getTime()}`),
            (iter: any) => iter as string
        ).promise();

        if (page.code == 200) {
            return page.data;
        } else {
            throw ``;
        }
    }

}