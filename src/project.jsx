import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, ProjectPage, StatusLozenge } from "@forge/ui";


const fetchEvents = async () => {
    const res = await api
        .asUser()
        .requestJira(route`/rest/api/3/search?jql=project=AEP`);
    const data = await res.json();
    return data;
};


const App = () => {

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

    // var issueArrStr = JSON.stringify(issueArr)

    return (
        <ProjectPage>
            {issueArr.map(function (issue, i) {
                return <Fragment>
                    <Text> TASK: <StatusLozenge text={issue.type} appearance="inprogress" /></Text>
                    {
                        issue.description.map(function (desc, i) {
                            return <Text>DESC: {desc}</Text>
                        })
                    }
                    <Text>................................................................</Text>
                </Fragment>;
            })
            }
        </ProjectPage>
    );
};

export const run = render(<App />);
