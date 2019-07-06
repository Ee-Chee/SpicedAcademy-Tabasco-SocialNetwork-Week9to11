# SpicedAcademy-Tabasco-SocialNetwork
This is a social network which users can sign up, say a little about themselves, become friends with other users and even build a snowman together. This is also a single-page application made with React.js. Interesting? Register an account with your friends and have fun together: https://momentmal.herokuapp.com.

## Features
1) Registration
* When logged-out users arrive at the site, they should be redirected to a /welcome route that serves the same HTML file as / and it should show a UI that looks something like this:

<img src="registration.png">

* The page shows the social network's identity in a large display. A form with the fields: first name, last name, email and password. Also a button to submit the registration form.
* Two React components are required to create this display. A component called Registration that displays the registration form itself.
A component called Welcome that renders Registration as well as the surrounding UI. The form is made to be its own component so that there is an option of placing it in other contexts. 
* Registration is a stateful component. That is, it is created using class since it needs to have a state property that is updated in response to changes. For example, if the axios response to the POST triggered by clicking on the button indicates that something went wrong, an error message will be rendered.

2) Log-in 
* A new component called Login is required for this form. This component works pretty much like Registration. It submits user input via axios and redirect upon success. It also displays a message if an error occurs.
* The real challenge here is swapping out the Registration component for the Login component when the user clicks the link. It is accomplished by using React Router. React Router lets you specify in JSX what components should display when specific urls are navigated to. For this part of the project HashRouter is used.
* When users log-in successfully, a cookie is created and they are redirected to page with a new top-level component named App that containes Logo, user ID, avatar, log-out, profile picture(avatar) uploader and other components. 

<img src="log-in.png">

3) Uploading avatar
* As soon as users log-in, App makes an axios request in the componentDidMount method to get basic data about the user such as id, first name, last name, and their avatarurl. Then, it passes the avatar url to Avatar component.
* Avatar displays the image. If there is no url, a default user image is displayed.
* The next child component of App, Uploader is only visible after the user clicks on the avatar. Its display is determined by a property of the state of the App component called uploaderVisible. Avatar is passed with a function from App. Upon clicking, event is triggered and the function is called to set this property to true making Uploader visible.
* The Uploader component is also passed a function for setting the avatarurl of the App component's state. After a successful upload, it calls this function and pass to it the url of the image that was just uploaded, causing Avatar to automatically switch to the new image. Finally, the function for setting avatarurl also sets uploaderVisible to false.

<img src="upload.png">

4) Profile and biography
* Users' profile information is shown when they first log in. This includes their name, their avatar and their bio. On this screen, users are able to update their profile picture and edit their bio(or add one if they haven't already).
* The Profile component is responsible for laying out the content: the user's name, profile picture, and bio. Profile is also a direct child of App.
* The Profile component itself contains two other components:
a. The existing Avatar component.
b. A new BioEditor component, which handles the user's bio. 
* The logic for determining what to show in the render function of BioEditor goes like this:

```
  Is the bio being edited?
          /       \
         /         \
    yes /           \ no
       /             \
      /               \
<textarea>           Is there a saved bio already?
"Save" button                 /       \
                             /         \
                        yes /           \ no
                           /             \
                          /               \
            Current bio text             "Add" button
            "Edit" button
```

* Since information that Profile needs to show is held in the state of App, App passes this information that BioEditor and the second Avatar need as props to Profile and then Profile passes those props to its children.

<img src="profile-bio.png">

<img src="profile-bio2.png">

5) Viewing other profiles by changing user ID from url
* The responsibility of the OtherProfile component is to show the profile information of a user other than the logged-in user. 
* When OtherProfile mounts, it makes a request to retrieve the relevant profile information. This means it must know the id of the user whose profile it is to display. This id comes from the url. Users can set the path of the Route that renders OtherProfile to a value such as '/user/:idnum', the component will automatically receive a prop named match that contains information about how React Router interpreted the url. The match object has a property named params(this.props.match.params.idnum), an object that has properties for each segment of the path you marked with a colon(in this case, it is 'idnum'). With this, the user ID now is accessible.

<img src="otherprofile.png">

6) Friend Request
* A Friendship component is created as a child of the OtherProfile component to allow users to friend and unfriend other users.
* The logic for determining what the button should say and what should happen when it is clicked goes likes this:

```
Is there an existing request between the profile viewer and profile owner?
                            /           \
                           /             \
                       no /               \ yes
                         /                 \
                        /                   \
       "Send Friend Request"              Is the request accepted?
                                                /           \
                                               /             \
                                           no /               \ yes
                                             /                 \
                                            /                   \
            Is the profile owner the recipient?              "Unfriend"
                       /           \
                      /             \
                  no /               \ yes
                    /                 \
                   /                   \
"Accept Friend Request"             "Cancel Friend Request"


profile viewer = the logged-in user, the one who is viewing the profile
profile owner = the user whose profile is being viewed, the one whose id is in the url
```     

7) My snow builders
* 'My snow builders' is the second tab menu. It contains Friends component that allows users to see all of the users who have sent them friend requests that they have not yet accepted as well as the full list of all their friends. The path for this screen is '/friends'.
* The friends and potential friends shown in these two lists are linked to the appropriate profiles. Displayed with each added friend  a link or a button that allows the user to end the friendship. Displayed with each requester should be a link or button for accepting the request.
<img src="friends.png">
**_NOTES_**:
* Coding technologies: HTML, CSS, Javascript
Webpack, the tool we use to compile our code, will start with src/start.js. Any js file that start.js imports from (as well as the files that those files import from) will be included in the bundle. The js files you create and import should be placed in the src directory.
other min project redux
