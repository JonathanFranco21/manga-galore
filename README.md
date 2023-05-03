The Manga Galore!! Web Application Documentation
by Jonathan Franco

This is the Manga Galore!! web application project is a project 
that serves as a spiritual sequel to the Anime Galore!! webpage 
that is on GitHub pages, in which the link is provided here in 
the documentation: 

https://jonathanfranco21.github.io/Anime_And_Manga_Project/

This web application is an application that connects to a MongoDB 
database that consists of several collections, which include manga, 
manga_instances, author, and genre. These four are used to help organize 
several important factors that can help anime and manga fans to be able 
to find either new manga or even find out more about their favorite manga. 
This web application also gives users the chance to be able to get to add
more of their own favorite manga, authors, manga instances, and genres as 
well. This README.md file will go over the necessary functions, files, and 
libraries that help make this web application functional and appealing in 
both the user experience (UX) and the user interface (UI).

First will be the libraries used to help make the web application 
function the way that it needs to. These libraries include async Version 
^3.2.4 (a library that helps let different multiple requests to be sent 
from the client to the server easier and quicker), cookie-parser Version 
^~1.4.4(a library that is used to parse and help access cookie information 
easier for a better user experience), debug Version ^~2.6.9(a library that 
helps to let the programmer be able to have the program), express Version 
~4.16.1(a library that helps form a fast, minimal web frame), 
express-async-handler Version ^1.2.0(a library that serves as an Express 
async middleware), express-validator Version ^6.15.0(a library that servers 
as an Express validation middleware), handler Version ^0.1.3(), http-errors 
Version ~1.6.3(a library that helps to show errors ), luxon Version ^3.3.0
(a library that helps format the time easier and cleaner for a more organized 
front end experience), mongoose Version ^6.9.0(a library that helps connect 
the web application to the MongoDB database), morgan Version ~1.9.1(a library 
that is an HTTP logger middleware), and pug Version ^2.0.0-beta11(a template 
library that helps render HTML pages in an easier fashion and it helps the 
programmer to write less code). Each of these libraries are all installed 
through the command npm I or npm install.

What helps the user to have a good user experience is with the front-end 
side with using .pug files. .pug files are HTML template files that will be 
rendered correctly and can use css files to be able to stylize the front end 
the way the programmer wishes. Css files are found in the public folder in 
the main project and are stored in the stylesheets subfolder in which there 
are newer features that are used to help render several images. This is done 
in app.js with app.use(express.static(‘public’));. With this line of code, it 
can be able to help render the images correctly on the main web app. Images 
are rendered in the .pug files with the img(src=’’) line of code. Alt=’’ and 
style=’width’ are used to help style the image the way it should look on the 
pages that need it. All images are able to be accessed in the public file and 
then going into the images subfile and in order for images to be shown on the 
web application, the path has to be a relative path, so it would be 
‘images/image.jpg’ in case if the programmer wants to show an image from their 
local machine instead of having to store it on a database and grabbing the file 
from there.

All .pug files are found within the views folder and there are many pug 
files. This includes four pug files that help form the manga details, manga 
delete options, manga list, and a manga form to add another entry to the 
manga collection on the MongoDB database, the mangainstance details, 
mangainstance delete options, the mangainstance list, and a mangainstance 
form to add another entry to the mangainstance collection on the MongoDB 
database, the author details, the author delete option, the author list, and 
an author form to add another entry to the author collection on the MongoDB 
database, and the genre details, the genre delete options, the genre list, 
and a genre form to add another entry to the genre collection on the MongoDB 
database. With these files are also .pug files, there is an error.pug file 
that helps print out the errors of the web application if something in the 
code doesn’t work or if the database cannot connect to the web application, 
an index.pug file that build the main part of the home page that will be rendered 
and showed first, and a layout.pug file that will help provide the structure of 
the sidebar navigation that is shown on the main page. This is followed by many
JavaScript files that help make up the back-end work for the user. 

There are several folders to help organize the necessary functions of 
the web application. For example, in the controllers folder, there are the 
authorController, genreController, mangaController, and mangainstanceController 
JavaScript files that help to form the main pages structures, forms, provide 
any errors that are present if it’s on the back-end or front-end code or if 
it’s an error that user is performing when on the web application. In the routes 
folder, there are the author, genre, manga, and mangainstance JavaScript files 
that are used to help provide the different routes for navigation purposes and 
help to provide the Schema of what kind of information each category needs to 
have as well as form and render the information the correct way to help with the 
user’s experience to not be stressful. There is also the most important JavaScript 
file, which would be app.js, which is where every library that is shown in the 
package.json file that is provided with every Express web application project is 
used to help parse and power the web application correctly. The app.js file is also 
used to help connect the web application to the MongoDB database be connecting it 
to the URL of the database. This is used to help transfer the information that is 
input into the forms and sent so that way it is then rendered and shown onto the 
front-end side of the web application. This is where the routes from index.js (a
JavaScript file that is used to establish which of the JavaScript files and pug 
files is the initial page that users will see when they start the web application), 
catalog.js(a JavaScript file that is used to help establish the many routes needed 
for the application, which will use the CRUD operations to GET, POST, DELETE, and 
UPDATE information in every page on the web application), and user.js(a JavaScript 
file that can let other users log onto the web application and provide their own 
information onto it) are also established to be able to show exactly how the 
application works and how to navigate through it correctly. This web application’s 
data is uploaded originally with the populated.js to help pass basic information 
from the previous library example to help establish a connection between the web 
application and the MongoDB database and is then disregarded when the other forms 
of information are provided and used to help make the application show only manga 
related information, which includes the authors, manga, manga instances, and genres. 
This web application has helped to establish a better understanding of what npm can 
do to help boost a web application with these different middleware libraries, what 
Express can do to help create a more dynamic project, and JavaScript files can help 
to form every part of this project in both a front end perspective and a back end 
perspective.
# manga-galore
