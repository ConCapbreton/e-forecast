Enhanced Forecast! A Typescript React surf forecasting site (using Tailwind CSS)

Overview:

Deciding when and where to surf in the south west of France is tricky. There are lots of variables that have a significant impact in the quality of the waves; swell, wind, tide etc. Enhanced forecast takes into account all of these factors and tells you when and where to surf as well as providing a detailed general forecast. 

Technical features: 

- The website calls data from 3 APIs. The app stores the data received from the three APIs on the first call locally and only re-requests the data if the stored data is deleted or it is out of date.
- The site makes use of several of React's hooks including useState, useEffect, useContext, useRef etc.
- Manipulation of data using .map(), .filter(), for loops, .forEach(), .indexOf(), .sort(), .reduce(), toFixed(). slice() etc
- Time corrections for the API data (provided in UTC) to show local times.
- Date re-formatting to make data readable and useful for users using .toLocaleDateString() and .toDateString(), .getDate(), .setDate() etc

Enhancement ideas:

- store the API KEY more securely using an Environment Variable on Netlify or Netlify Functions
- consider a user login
- tide data as a graph  
- create a blog to record site recomendations vs actual conditions (and update data manipulation accordingly to improve the site)
- the code could be more dry by consolidating some of the When and Where code into the context file. However, it is also an advantage to have these two functions completely seperate from each other should, in the future, you want to update one but not the other.  
