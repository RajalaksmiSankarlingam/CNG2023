import api, { route, fetch } from "@forge/api";

import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, ProjectPage, StatusLozenge,MacroConfig ,Table, Head, Cell, Row,Select, Option, Button, Checkbox, CheckboxGroup, Form, useEffect } from "@forge/ui";

// const [events, setEvents] = useState('');

const fetchEvents = async () => {
    const context = useProductContext();
    let currentProjectKey = context.platformContext.projectKey;
    
    const res = await api
        .asUser()
        .requestJira(route`/rest/api/3/search?jql=project=${currentProjectKey}`);
        const data = await res.json();
    
        // setEvents(data);
        return data;
};

const App = () => {

    const [isAllChecked, setAllChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [events, setEvents] = useState([]);
    const context = useProductContext();
    let currentProjectKey = context.platformContext.projectKey;
    useEffect(() => {
        const fetchEvents = async () => {
          const response = await api
          .asUser()
          .requestJira(route`/rest/api/3/search?jql=project=${currentProjectKey}`);
          const data = await response.json();
          setEvents(data);
        };
        fetchEvents();
      }, []);
    
    // setEvents(JSON.stringify(data));

    const handleCheckAll = () => {
        setAllChecked(!isAllChecked);
        if (!isAllChecked) {
          setSelectedRows(issueArr.map((row,i) => i));
        } else {
          setSelectedRows([]);
        }
    };

    const renderTableHeaders = () => {
        return <Fragment>
            <Head>
                <Cell><CheckboxGroup name="products"><Checkbox label="select all" isChecked={isAllChecked} onChange={handleCheckAll} /></CheckboxGroup></Cell>
                <Cell><Text>Story Name</Text></Cell>
                <Cell><Text>Description/Summary</Text></Cell>
                <Cell><Text>points</Text></Cell>
                <Cell><Text>dev hours</Text></Cell>
                <Cell><Text>Suggested Devekoper</Text></Cell>
                </Head>
        </Fragment>
    }

    const handleCheckRow = (id) => {
        const index = selectedRows.indexOf(id);
        if (index !== -1) {
          setSelectedRows(selectedRows.filter(row => row !== id));
        } else {
          setSelectedRows([...selectedRows, id]);
        }
    };

    const renderCheckBox = (id) =>{
        return <Checkbox isChecked={selectedRows.includes(id)} onChange={()=>handleCheckRow(id)} />
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

    const renderSuggestedDeveloper = () => {
        return <Cell><Text>Naveen Kumar</Text></Cell>
    }

    const renderSprintDropdown = () => {
        const options = [
          { label: 'Sprint 1', value: 'Sprint 1' },
          { label: 'Sprint 2', value: 'Sprint 2' },
          { label: 'Sprint 3', value: 'Sprint 3' }
        ];
        return (
            <Select name="select-sprint" label="Select Sprint">
              {options.map(option => (
                <Option value={option.value} label={option.label} />
              ))}
            </Select>
        );
    }

    const renderStoryPointButton = () =>{
        const [storyPoints, setStoryPoints] = useState('');
        const handleStoryPoint = async() => {
            const res = await fetch("https://7ebe-223-187-124-8.ngrok-free.app").then(response => response.text())
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


//  const events = useState(async () => await fetchEvents());
//  var issueArr = []


//  events[0].issues.forEach(issue => {

//  var issueDescriptionMap = {}

//  if (issue.fields.issuetype.name == 'Task') {




//  var descArr = []

//  issue.fields.description.content.forEach(contentElement => {




//  contentElement.content.forEach(content => {

//  if (content.type = "Text") {

//  descArr.push(content.text)

//  }

//  });




//  });

//  issueDescriptionMap.type = issue.fields.summary;

//  issueDescriptionMap.description = descArr

//  issueArr.push(issueDescriptionMap)

//  }

//  });



 return (
    <ProjectPage>
        <Form onSubmit={(e)=>e.preventDefault()}>
        {/* {renderSprintDropdown()} */}
        {renderStoryPointButton()}
        {/* {renderDevHourButton()}
        {renderSuggestedDeveloperButton()} */}
        
        {/* <Table> */}
            {/* {renderTableHeaders()} */}
            {/* {issueArr.map(function (issue, i) {
                return <Fragment>
                        <Row>
                            <Cell>
                                <CheckboxGroup name={"products"}>
                                    {renderCheckBox(i)}
                                </CheckboxGroup>    
                            </Cell>
                            {renderTask(issue.type)}    
                            {renderDescription(issue.description)}
                            {renderPoints()}
                            {renderDevHours()}
                            {renderSuggestedDeveloper()}
                        </Row>
                    </Fragment>;
                })
            } */}
        {/* </Table> */}
        <Text>{JSON.stringify(events)}</Text> 
        </Form>
    </ProjectPage>
    );
};




export const run = render(<App />);