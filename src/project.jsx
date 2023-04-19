import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, ProjectPage, StatusLozenge } from "@forge/ui";

const mapFieldNames = (issueFields) => {

  var issueDescriptionMap = {}

  //ISSUE TYPE
  issueDescriptionMap["ISSUE TYPE"] = issueFields.issuetype? issueFields.issuetype.name: null;

  //STORY POINT ESTIMATE
  issueDescriptionMap["STORY POINT ESTIMATE"] = issueFields.customfield_10016

  //STORY POINT
  issueDescriptionMap["STORY POINT"] = issueFields.customfield_10040

  //DESCRIPTION
  issueDescriptionMap["DESCRIPTION"] = ''

  if (issueFields.description && issueFields.description.content) {
    issueFields.description.content.forEach(contentElement => {
      contentElement.content.forEach(content => {
        if (content.type = "Text") {
          issueDescriptionMap["DESCRIPTION"] += content.text;
        }
      });

    });
  }

  //ASSIGNEE
  issueDescriptionMap['ASSIGNEE'] = issueFields.assignee ? issueFields.assignee.displayName : "UNASSIGNED"

  return issueDescriptionMap

}

const fetchEvents = async () => {

  var bodyData = `{
        "expand": [
          "renderedFields",
          "names",
          "schema"
        ],
        "fields": [
          "description",
          "summary",
          "status",
          "assignee",
          "customfield_10016",
          "customfield_10040",
          "issuetype"
        ],
        "fieldsByKeys": false,
        "jql": "project=AEP",
        "maxResults": 15,
        "startAt": 0
      }`;

  const res = await api.asApp().requestJira(route`/rest/api/3/search`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyData
  });

  // const res = await api
  // .asUser()
  // .requestJira(route`/rest/api/3/field`);

  const data = await res.json();
  return data;
};


const App = () => {

  const events = useState(async () => await fetchEvents());
  var issueArr = []

  events[0].issues.forEach(issue => {
    var issueDescriptionMap = {}
    if (issue.fields.issuetype.name == 'Task') {
      issueDescriptionMap = mapFieldNames(issue.fields);
      issueArr.push(issueDescriptionMap)
    }
  });

  var issueArrStr = JSON.stringify(issueArr)
  console.log("issueArrStr::" + issueArr)

  return (
    <ProjectPage>
      <Text>{issueArrStr}</Text>
      <Text>{JSON.stringify(events)}</Text>
      

      {/* {issueArr.map(function (issue, i) {
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
            } */}


        {issueArr.map(function (issue, i) {
          return <Fragment>
            {
              Object.keys(issue).map(function (keyName, keyIndex) {
                return <Fragment>
                          <Text> {keyName} <StatusLozenge text={issue[keyName]} appearance="inprogress" /></Text>
                    </Fragment>
              })
            }
            <Text>**********************************************************************************</Text>
          </Fragment>;
        })
        }
 


      {/* {issueArr.map(function (issue, i) {
                return <Fragment>
                    <Text> TASK: <StatusLozenge text={issue.type} appearance="inprogress" /></Text>
                    {
                        issue.description.map(function (desc, i) {
                            return <Text>DESCCC: {desc}</Text>
                        })
                    }
                    <Text>................................................................</Text>
                </Fragment>;
            })
            } */}
    </ProjectPage>
  );
};

export const run = render(<App />);
