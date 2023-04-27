import api, { route, fetch } from "@forge/api";
import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useEffect, useState, ButtonSet, Button } from '@forge/ui';
const appConstants =  {
    CARD : {
        STORY_POINT_ESTIMATE : "Story Point Estimate :",
        DEVELOPER_ESTIMATE : "Lead Developer Estimate :"
    },
    PREDICT_STORY_POINT_URL : "https://ab39-157-51-85-91.ngrok-free.app/predict_spe",
    PREDICT_ASIGNEE_POINT_URL : "https://ab39-157-51-85-91.ngrok-free.app/predict_assignee"
}
const App = () => {
    const { platformContext } = useProductContext();
    const [issue, setIssue] = useState([]);
    /**
     * @author Keerthana Ravindran
     * @description Fetches all issues related to the current active sprint and also populate object for performing other POST requests for prediction calls
     */
    useEffect(async()=>{
        const response = await api.asApp()
        .requestJira(route`/rest/api/2/issue/${platformContext.issueKey}`);
        const data = await response.json();
        setIssue(data);
        let issueObj = {
        "ISSUE TYPE" : data.fields.issuetype.name,
        "STORY POINT ESTIMATE" : data.fields.customfield_10016,
        "STORY POINT" : null,
        "SUMMARY" : data.fields.summary,
        "ASSIGNEE" : data.fields.assignee
        }
        let arr = [];
        arr.push(issueObj);
        setIssue([...arr]);
    },[])


    const [storyPoint, setStoryPoint] = useState(null);
    /**
     * @author Keerthana Ravindran
     * @description For all the Issues related to the current sprint, estimate the Story points
     * @returns Displays an action button called "Estimate Story Point"
     */
    const renderStoryPointButton = () =>{
        let reqbody = {
            "model": "lr.sav",
            "data": issue
        };
        const handleStoryPoint = async() => {
            const res = await fetch(appConstants.PREDICT_STORY_POINT_URL,
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(reqbody)
            }).then(response => response.text())
                .then(data => {
                    let storyPointArrData = JSON.parse(data)
                    let story_points = storyPointArrData["DATA_PREDICTION"]
                    setStoryPoint(story_points[0])})
        };
        return (
            <Button text="Estimate Story Point" onClick={handleStoryPoint} />
        );
    }

    const [suggestedDeveloper, setSuggestedDeveloper] = useState([]);
    /**
     * @author Keerthana Ravindran
     * @description For all the Issues related to the current sprint, predict the Developer to be assigned
     * @returns Displays an action button called "Suggest Developer"
     */
    const renderSuggestedDeveloperButton = () =>{
        let reqbody = {
            "model": "lr.sav",
            "data": issue
        };
        const handleSuggestedDeveloper = async() => {
            const res = await fetch(appConstants.PREDICT_ASIGNEE_POINT_URL,
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(reqbody)
            }).then(response => response.text())
                .then(data => {
                    let storyPointArrData = JSON.parse(data)
                    let developers = storyPointArrData["DATA_PREDICTION"]
                    setSuggestedDeveloper(developers[0])
                    })
        };
        return (
            <Button text="Suggest Developers" onClick={handleSuggestedDeveloper} />
        );
    }

    return (
        <Fragment>
        <ButtonSet>
            {renderStoryPointButton()}
            {renderSuggestedDeveloperButton()}
        </ButtonSet>
        <Text> {appConstants.CARD.STORY_POINT_ESTIMATE} {storyPoint}</Text>
        <Text> {appConstants.CARD.DEVELOPER_ESTIMATE} {suggestedDeveloper}</Text>
        </Fragment>
    );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);