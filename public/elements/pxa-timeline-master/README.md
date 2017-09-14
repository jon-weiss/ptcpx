#pxa-timeline

[![px-progress-bar demo](https://github.build.ge.com/storage/user/13656/files/eee93756-a66a-11e6-90f7-2d6bb96919bc)](https://github.com/PredixDev/px-progress-bar)

## Overview

pxa-timeline is a Predix UI component providing a vis timeline chart, which displays items grouped on a timeline.

## Usage

### Prerequisites
1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.

## Getting Started

First, install the component via bower on the command line.

```
bower install Pxa-Timeline --save
```

Second, import the component to your application with the following tag in your head.

```
<link rel="import" href="/bower_components/Pxa-Timeline/Pxa-Timeline.html"/>
```

Finally, use the component in your application:

```
<pxa-timeline timeline-start-date="2016-10-25T09:00:00.360Z" timeline-end-date="2016-10-26T23:00:00.360Z" data-source="url" data="https://predix-nodejs-dataserver-bw.run.aws-usw02-pr.ice.predix.io/getdata/timeline"></pxa-timeline>
```

<br />
<hr />

## Documentation

The Predix Timeline chart is an implementation of Vis Groups Performance chart. This component takes a set of orders and displays it in a grouped manner on a timeline.

pxa-timeline component expects upto 5 arguments out of which 3 are optional.
```
1. timelineId (optional)          : Required only if the page contains more than 1 timeline chart and should be unique for each timeline chart
2. timeline-start-date (optional) : Javascript datetime object indicating the timeline start datetime
3. timeline-end-date (optional)   : Javascript datetime object indicating the timeline end datetime
4. data-source (required)         : "url" if data has to be fetched from a URL or "attribute" if JSON data is passed as an attribute
5. data (required)                : URL if data-source is url and JSON data if data-source is attribute
```

data-url JSON object is expected in the following format
```
{
  "groups": [
    {
      "id": 1,
      "content": "Group 1"
    },
    {
      "id": 2,
      "content": "Group 2"
    }
  ],
  "items": [
    {
      "id": 1,
      "group": 1,
      "start": "2016-10-13T13:34:41.053Z",
      "end": "2016-10-13T14:54:05.623Z",
      "content": ""
    },
    {
      "id": 2,
      "group": 1,
      "start": "2016-10-13T16:02:44.180Z",
      "end": "2016-10-13T16:52:00.770Z",
      "content": ""
    },
    {
      "id": 3,
      "group": 2,
      "start": "2016-10-13T13:00:41.475Z",
      "end": "2016-10-13T13:37:14.058Z",
      "content": ""
    },
    {
      "id": 4,
      "group": 2,
      "start": "2016-10-13T14:07:44.313Z",
      "end": "2016-10-13T14:58:21.972Z",
      "content": ""
    },
  ]
}
```

data-url JSON object contains 2 object arrays
```
1. groups
  1.1 id      : This is used to group orders and each id should be unique
  1.2 content : This will be displayed as the group name at the left side for each group
2. items      :
  2.1 id      : This is simply an id for each unique order
  2.2 group   : This should match groups.id for orders to be grouped properly
  2.3 start   : This is the order start time
  2.4 end     : This is the order end time
  2.5 content : This is optional and if present will be contained as a label inside each order
  2.6 color   : This is optional and if present this color will be applied to the item
```


## Local Development

From the component's directory...

```
$ npm install
$ bower install
```

From the component's directory, to start a local server run:

```
$ gulp
```

Navigate to the root of that server (e.g. http://localhost:8080/) in a browser to open a demo of the component.

### GE Coding Style Guide
[GE JS Developer's Guide](https://github.com/GeneralElectric/javascript)
