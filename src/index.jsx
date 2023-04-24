import api, { route } from "@forge/api";

import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, ProjectPage, StatusLozenge ,Table, Head, Cell, Row } from "@forge/ui";
const fetchEvents = async () => {
    const context = useProductContext();
    let currentProjectKey = context.platformContext.projectKey;
    
    const res = await api
        .asUser()
        .requestJira(route`/rest/api/3/search?jql=project=${currentProjectKey}`);
        const data = await res.json();
        return data;
};

const App = () => {

    const renderTableHeaders = () => {
        return <Fragment>
            <Head>
                <Cell><Text>Story Name</Text></Cell>
                <Cell><Text>Description/Summary</Text></Cell>
                <Cell><Text>points</Text></Cell>
                <Cell><Text>dev hours</Text></Cell>
                </Head>
        </Fragment>
    }

    const renderTask= (issueType) =>{
        return <Cell><Text><StatusLozenge text={issueType} appearance="inprogress" /></Text></Cell>
    }

    const renderDescription = (descriptions) => {
        return <Cell>{descriptions.map(function (desc, i) {
            return <Text> {desc} </Text>
        })}</Cell>
    }

    const renderPoints = () => {
        return <Cell><Text>5</Text></Cell>
    }

    const renderDevHours = () => {
        return <Cell><Text>8</Text></Cell>
    }

 const events = useState(async () => await fetchEvents());

 var issueArr = []


 events[0].issues.forEach(issue => {

 var issueDescriptionMap = {}

 if (issue.fields.issuetype.name == 'Task') {




 var descArr = []

 issue.fields.description.content.forEach(contentElement => {




 contentElement.content.forEach(content => {

 if (content.type = "Text") {

 descArr.push(content.text)

 }

 });




 });

 issueDescriptionMap.type = issue.fields.summary;

 issueDescriptionMap.description = descArr

 issueArr.push(issueDescriptionMap)

 }

 });



 return (
    <ProjectPage>
        <Table>
            {renderTableHeaders()}
            {issueArr.map(function (issue, i) {
                return <Fragment>
                        <Row>
                            {renderTask(issue.type)}    
                            {renderDescription(issue.description)}
                            {renderPoints()}
                            {renderDevHours()}
                        </Row>
                    </Fragment>;
                })
            }
        </Table>
                
    </ProjectPage>
    );
};




export const run = render(<App />);