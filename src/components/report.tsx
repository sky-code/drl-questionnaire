import {useUserContext} from "~/utils/user";
import {trpc} from '~/utils/trpc';
import {Table} from "react-bootstrap";

const Report = () => {
    const [user] = useUserContext();
    const reportQuery = trpc.useQuery(['questionnaire.report', {userEmail: user!}]);
    if (reportQuery.status !== 'success') {
        return <>Loading...</>;
    }
    const {data} = reportQuery;

    const ReportLine = ({reportObject, fieldName}: { reportObject: any, fieldName: string }) => {
        const percentage = reportObject[fieldName + 'Percentage']
        return <td>{reportObject[fieldName]} {percentage != null ? `| ${percentage}%` : null}</td>
    }

    return (<>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th></th>
                <th>Today compared to average</th>
                <th>Your average compared to average of all people of the same age on the platform</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Happy</td>
                <ReportLine reportObject={data.diffTodayToAverage} fieldName={'happy'}></ReportLine>
                <ReportLine reportObject={data.diffUserAverageToSameAgeGroup} fieldName={'happy'}></ReportLine>
            </tr>
            <tr>
                <td>Energetic</td>
                <ReportLine reportObject={data.diffTodayToAverage} fieldName={'energetic'}></ReportLine>
                <ReportLine reportObject={data.diffUserAverageToSameAgeGroup} fieldName={'energetic'}></ReportLine>
            </tr>
            <tr>
                <td>Hopefull</td>
                <ReportLine reportObject={data.diffTodayToAverage} fieldName={'hopefull'}></ReportLine>
                <ReportLine reportObject={data.diffUserAverageToSameAgeGroup} fieldName={'hopefull'}></ReportLine>
            </tr>
            <tr>
                <td>Slept hours</td>
                <ReportLine reportObject={data.diffTodayToAverage} fieldName={'sleptHours'}></ReportLine>
                <ReportLine reportObject={data.diffUserAverageToSameAgeGroup} fieldName={'sleptHours'}></ReportLine>
            </tr>
            </tbody>
        </Table>
    </>)
}
export default Report