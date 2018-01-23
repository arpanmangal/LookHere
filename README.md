# LookHere

App for code.fun.do

Deployed Here :- 
- [Azure Website](https://lookhere.azurewebsites.net/)
- [GitHub Pages](https://arpanmangal.github.io/LookHere/)

-----------------------------------------------------------------------

This is an App which is used for checking the attention levels of your audience. Whether you are a teacher who wants the data of his / her class about how many students are paying attention and which topics are particularly boring, or you are an online course provider and want to monitor attention levels of your remote student, this app is perfect for you.<br /><br />
This app measures the attention levels of students as a function of time using Microsoft Face API. It plots a graph of variation of attention with time. On completion of your presentation it will also provide you with an in-depth analysis of your class stats which include the complete variance-time graph and a attention level graph over the slide depicting the rise and fall of attention levels during different slides.

<br /><br />
## How to Use -
1. Refer to [this](https://www.youtube.com/watch?v=NRfxfM6vLCY) YouTube Video for reference.
2. Open one of the links to the website above.
3. Select your mode of operation. Either choose a pdf file or embed a video (see the reference video for details).
4. Allow your webcam to take video. This will take real-time data of your face and attention levels.
5. This data will be plotted as a real-time plot and will be available to the user to see.
6. Change slides using the arrow buttons and zoom using '+' and '-' buttons.
7. When done with the presentation / video lecture click on 'stop observation'.
8. A new graph will load showing the complete graph as well as a slide wise analysis of attention levels.

------------------------------------------------------------------------
## TODO -

1. UI improvements (~~add modal that loads in the beginning, describing the project and taking pdf path as input from user~~)
2. ~~Allow user to 'Finish Session', after which we can see graph for overall session and some statistics summarizing the attention levels for entire session.~~

-------------------------------------------------------------------------


## Things to work on :-
1. Explore other ways of estimating attention
2. **How the app will actually be run in practice, what the dashboard will be like,how a user can view results of previous presentations/videos.**

-----------------------------------------------------------------------------------------

## TODO (for OnCampus) -

1. Change variation method to eye-coordinates from headPose.
2. Take images from mobile camera and use that => Use pre-built app
3. Plot of video with its timestamp
4. Option to download the stats and data once observation stops

Note:- Has been tested on Firefox and Chrome.
