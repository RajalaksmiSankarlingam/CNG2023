import api, { route, fetch } from "@forge/api";

import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, ProjectPage, StatusLozenge,MacroConfig ,Table, Head, Cell, Row,Select, Option, Button, Checkbox, CheckboxGroup, Form, useEffect, Heading, Badge, Strong } from "@forge/ui";
import { useTable } from 'react-table';

// const [events, setEvents] = useState('');

const trainMockData = [
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 3,
      "STORY POINT": null,
      "SUMMARY": "Update existing servlet implementation extend BaseControllerServlet MyCase, ODR & XChange applications add authentication filters",
      "DESCRIPTION": "undefinedundefined",
      "ASSIGNEE": "VISHNU"
    },
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 5,
      "STORY POINT": null,
      "SUMMARY": "Research: Add ability to set Interview Condition logic for Templates",
      "DESCRIPTION": "Currently, conditional logic such as Interview Conditions is set on a field level per Content Form, and does not retain across Template usage in multiple Content Forms. Need to add the ability to set Interview Condition logic within a Template, such that admins can define Interview Conditions once within a Template, and reuse the same conditional logic by including the same Template within multiple Content Forms.",
      "ASSIGNEE": "VARSHINEE VENKATESAN"
    },
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 5,
      "STORY POINT": null,
      "SUMMARY": "Continuation - Form.io documentation",
      "DESCRIPTION": "prepare documentation for form.io styling and configuration Documentation link: FormIO Styling Document.docx",
      "ASSIGNEE": "RAJALAKSHMI"
    },
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 5,
      "STORY POINT": null,
      "SUMMARY": "Continuation - Research: integrate Rasa with Twilio Flex",
      "DESCRIPTION": "Need to explore integrating Rasa with Twilio Flex, as an alternative to using Google Dialogflow.",
      "ASSIGNEE": "VARSHINEE VENKATESAN"
    },
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 3,
      "STORY POINT": null,
      "SUMMARY": "Continuation - Add Gitlab pipeline to generate CourtsCommon Jar file to push to Nexus",
      "DESCRIPTION": "Add Gitlab pipeline to generate CourtsCommon Jar file to push to NexusundefinedRepo URL: https://slc-git01.utahcourts.local/development/all_dev/commonapps/courtscommon.git",
      "ASSIGNEE": "KEERTANA"
    },
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 5,
      "STORY POINT": null,
      "SUMMARY": "Continuation - Add FormEngine to GitLab DevOps Operation",
      "DESCRIPTION": "undefinedRepo URL: https://slc-git01.utahcourts.local/development/orange_dev/interview-apps/formengineWAS: https://dev-slc-ws-node03.utahcourts.local:9043/ibm/consoleApplication Name: FormEngineV5Context path: /FormEngineV5 App URL: https://devapps.utcourts.gov/FormEngineV5Servers to run :WebSphere:cell=dev-slc-ws-cell01,node=dev-slc-ws-ihs02,server=dev-slc-ws-ihs02\nWebSphere:cell=dev-slc-ws-cell01,node=dev-slc-ws-ihs01,server=dev-slc-ws-ihs01\nWebSphere:cell=dev-slc-ws-cell01,cluster=Application_Cluster",
      "ASSIGNEE": "KEERTANA"
    },
    {
      "ISSUE TYPE": "Task",
      "STORY POINT ESTIMATE": 3,
      "STORY POINT": null,
      "SUMMARY": "Update existing servlet implementation extend BaseControllerServlet MyCase, ODR & XChange applications add authentication filters",
      "DESCRIPTION": "undefinedundefined",
      "ASSIGNEE": "VISHNU"
    }
]

const App = () => {

    // const [isAllChecked, setAllChecked] = useState(false);
    // const [selectedRows, setSelectedRows] = useState([]);
    const [sprints, setSprints] = useState([]);
    const context = useProductContext();
    const [currentSprint, setCurrentSprint] = useState('');
    let currentProjectKey = context.platformContext.projectKey;

    const fetchEvents = async () => {
        const context = useProductContext();
        const res = await api
            .asApp()
            .requestJira(route`/rest/api/3/search?jql=project=${currentProjectKey} AND sprint in openSprints()`);
            const data = await res.json();
        
            return data;
    };

    useEffect(async()=>{
        const response = await api.asApp()
        .requestJira(route`/rest/agile/1.0/board/1/sprint`);
        const data = await response.json();
        let values = data.values;
        
        let currentSpr = values.find((x)=>{
            return x.state == 'active'
        })
        setCurrentSprint(currentSpr.name);
    },[])

    const renderTableHeaders = () => {
        return <Fragment>
            <Head>
                {/* <Cell><CheckboxGroup name="products"><Checkbox label="select all" isChecked={isAllChecked} onChange={handleCheckAll} /></CheckboxGroup></Cell> */}
                <Cell><Text>Story Name</Text></Cell>
                <Cell><Text>Description/Summary</Text></Cell>
                <Cell><Text>points</Text></Cell>
                <Cell><Text>dev hours</Text></Cell>
                <Cell><Text>Suggested Devekoper</Text></Cell>
                </Head>
        </Fragment>
    }

    // const handleCheckRow = (id) => {
    //     const index = selectedRows.indexOf(id);
    //     if (index !== -1) {
    //       setSelectedRows(selectedRows.filter(row => row !== id));
    //     } else {
    //       setSelectedRows([...selectedRows, id]);
    //     }
    // };

    // const renderCheckBox = (id) =>{
    //     return <Checkbox isChecked={selectedRows.includes(id)} onChange={()=>handleCheckRow(id)} />
    // }

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

    const renderSuggestedDeveloper = () => {
        return <Cell><Text>Naveen Kumar</Text></Cell>
    }

    const renderSprintDropdown = () => {
        const options = [
          { label: 'Sprint 1', value: 'Sprint 1' },
          { label: 'Sprint 2', value: 'Sprint 2' },
          { label: 'Sprint 3', value: 'Sprint 3' }
        ];

        const handleOptionChange = (event) => {
            const selectedOption = event.target.value;
            // Do something with the selected option
            setSelectedSprint(selectedOption);
        }

        return (
            <Select name="select-sprint" label="Select Sprint" onSelectChange={handleOptionChange}>
              {options.map(option => (
                <Option value={option.value} label={option.label}/>
              ))}
            </Select>
        );
    }

    const renderStoryPointButton = () =>{
        const [storyPoints, setStoryPoints] = useState('');
        let reqbody = {
            "model": "lr.sav",
            "data": issueData
        };
        const handleStoryPoint = async() => {
            const res = await fetch("https://b2a8-157-51-85-91.ngrok-free.app/predict_spe",
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(reqbody)
            }).then(response => response.text())
                    .then(data => setStoryPoints(data))
            console.log('story point button clicked!');
            
        };
        
        return (
            <Fragment>
                <Button text="Story points" onClick={handleStoryPoint} />
                <Text>{JSON.stringify(storyPoints)}</Text>
            </Fragment>
        );
    }

    const renderTrainButton = () =>{
        const [train, setTrain] = useState('');
        const handleTrainButton = async() => {
                const res = await fetch("https://b2a8-157-51-85-91.ngrok-free.app/train",{
                method: "POST", 
                mode: "cors",
                cache: "no-cache", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(trainMockData),
            }
            ).then(response => response.text())
                    .then(data => setTrain(data))
            console.log('story point button clicked!');
            
        };
        
        return (
            <Fragment>
                <Button text="Train" onClick={handleTrainButton} />
                {/* <Text>{JSON.stringify(train)}</Text> */}
            </Fragment>
        );
    }

    const renderDevHourButton = () =>{
        const handleDevHour = () => {
            console.log('DevHour button clicked!');
        };
        
        return (
            <Button text="Dev Hours" onClick={handleDevHour} />
        );
    }

    const renderSuggestedDeveloperButton = () =>{
        const handleSuggestedDeveloper = () => {
            console.log('SuggestedDeveloper button clicked!');
        };
        
        return (
            <Button text="Suggested Developer" onClick={handleSuggestedDeveloper} />
        );
    }


 const events = useState(async () => await fetchEvents());
 var issueArr = []

// -------------------------------
var issueData = []
 events[0].issues.forEach(issue => {

    let desc = '';
    if(issue.fields.description.content!=null ){
        issue.fields.description.content.forEach(contentElement => {
    
            if(contentElement.content!=null){
                contentElement.content.forEach(content => {
           
                    if (content.type = "Text") {
                   
                        desc+= content.text+'\n';
                   
                    }
                   
                });
            }
            
      
        });
    }

    let issueObj = {
        "ISSUE TYPE" : issue.fields.issuetype.name,
        "STORY POINT ESTIMATE" : issue.fields.customfield_10016,
        "STORY POINT" : null,
        "SUMMARY" : issue.fields.summary,
        "DESCRIPTION" : desc,
        "ASSIGNEE" : issue.fields.assignee
    }

    issueData.push(issueObj);
 })
// ------------------------------

 events[0].issues.forEach(issue => {

 var issueDescriptionMap = {}

 if (issue.fields.issuetype.name == 'Task') {




 var descArr = []
if(issue.fields.description.content!=null ){
    issue.fields.description.content.forEach(contentElement => {

        if(contentElement.content!=null){
            contentElement.content.forEach(content => {
       
                if (content.type = "Text") {
               
                descArr.push(content.text)
               
                }
               
            });
        }
        
  
    });
}
 

 issueDescriptionMap.type = issue.fields.summary;

 issueDescriptionMap.description = descArr

 issueArr.push(issueDescriptionMap)

 }

 });



 return (
    <ProjectPage>
        <Text><Strong>-------------    -------- ------------------</Strong></Text>
        <Heading size="Medium"><Text>{currentSprint}</Text></Heading>
        <Text><Strong>-------------    -------- ------------------</Strong></Text>
        {renderStoryPointButton()}
        {renderDevHourButton()}
        {renderSuggestedDeveloperButton()}
        {renderTrainButton()}
        <Table>
            {renderTableHeaders()}
            {issueArr.map(function (issue, i) {
                return <Fragment>
                        <Row>
                            {/* <Cell>
                                <CheckboxGroup name={"products"}>
                                    {renderCheckBox(i)}
                                </CheckboxGroup>    
                            </Cell> */}
                            {renderTask(issue.type)}    
                            {renderDescription(issue.description)}
                            {renderPoints()}
                            {renderDevHours()}
                            {renderSuggestedDeveloper()}
                        </Row>
                    </Fragment>
                }) 
             }
         </Table>
         {/* <Text>{JSON.stringify(events)}</Text> */}
    </ProjectPage>
    );
};




export const run = render(<App />);