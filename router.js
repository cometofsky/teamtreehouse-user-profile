"use strict";

const Profile  = require("./profile.js");
const renderer = require("./renderer.js");

const queryString = require("querystring");


function setHeader(response) {

    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
}


function home(request, response) {

    if (request.url == "/") {

        setHeader(response);

        renderer.view('header', {}, response);
        renderer.view('search', {}, response);
        renderer.view('footer', {}, response);
        response.end();
    }
}


function user(request, response) {

    if (request.url == "/user") {

        if (request.method.toLowerCase() === 'post') {

            request.on('data', (postBody) => {

                let body  = `${postBody}`;
                let query = queryString.parse(postBody.toString());

                setHeader(response);
                
                renderer.view('header', {}, response);

                let studentProfile = new Profile(query.username);

                studentProfile.on("end", function (profileJSON) {

                    let values = {
                        avatarUrl       : profileJSON.gravatar_url,
                        username        : profileJSON.profile_name,
                        badgeCount      : profileJSON.badges.length,
                        javascriptPoints: profileJSON.points.JavaScript
                    };

                    renderer.view('profile', values, response);
                    renderer.view('footer', {}, response);
                    response.end();
                });

                studentProfile.on("error", function (error) {

                    renderer.view('error', {errorMessage: error.message}, response);
                    renderer.view('search', {}, response);
                    renderer.view('footer', {}, response);
                    response.end();
                });
            });
        }
    }


}


module.exports.home = home;
module.exports.user = user;