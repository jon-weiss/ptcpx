# pxa-routebuilder-prototype

This project is a jumping-off point for fleshing out and testing the [pxa-svgdashboard](http://github.com/paelian/svg-dashboard) polymer control.

This project also uses another [toolbar control](http://github.com/paelian/dashboard-toolbar) to demonstrate how to link UI interactions (buttons) to [pxa-svgdashboard](http://github.com/paelian/svg-dashboard)'s *api*.

## Usage

- Download git repo
- Run `npm install` and `bower install` from the locally-installed project path
- Run this node-based application using `npm start`. Browse to the indicated port on the local machine.

## Usage - Runtime

There is an additional mocked-up runtime engine added to the repository. Its purpose is to simulate a workorder-driven shop floor workstation takt cycle. Accessing/running the module can be accomplished by running `gulp runtime`.

*It is highly recommended you read/understand the runtimeEngine.js file prior to running it* 

## Updating polymer controls

Occasionally you will need to update the hosted controls. There is an included *bash* script that will facilitate (for the time being) the update process. Execute from a *git bash* (or equivalent) command line:
```
bash pxaupdate.bash
```
This will remove the hosted controls locally and re-acquire from source.

## Dependencies

This project is dependent on the following:

- [node](https://nodejs.org)
- [bower](https://bower.io)
- [polymer](https://www.polymer-project.org/1.0/docs/about_10) and [ES6 for polymer](https://www.polymer-project.org/blog/es6)
- [jquery](https://jquery.com), [jquery-ui](https://jqueryui.com) (for draggables), and [jquery-svg](https://libraries.io/bower/jquery-svg) (bower project, [Keith Wood's original project here](http://keith-wood.name/svg.html))
- [pxa-svgdashboard](http://github.com/paelian/svg-dashboard)
- [toolbar control](http://github.com/paelian/dashboard-toolbar)
