# Air Berlin by 404NotFound Team

## Installation
* `git clone https://github.com/secourse2016/404notfound.git` (Clone the project to your machine)
* `cd 404notfound` (Change directory to the website's folder)
* `npm install -g gulp `
* `npm install` (To install node modules *remember these packages are backend packages*)
* `gulp install` (You can type it as is in the terminal `&&` will execute the two commands *these packages are front end packages(angular,bootstrap...)* )  * `gulp`  (This will start the server using nodemon and watch for any changes to our js files and update the generated files accordingly)

## Notes
* The booking post request doesn't send the authentication header for some weird reason(newer version of $http is causing that problem, downgrading the version of Angular should fix the problem but will break other dependencies), luckily Turkish Airlines didn't implement authentication on their booking route so our app is working just fine with them.
* Querying other airlines isn't 100% reliable in this version of the code, the fix is already on the server and it's a small change so if it doesn't work out of the box please contact me(Ahmed Elhanafy).
* Our ionic app is working in Ionic view with no problems.
