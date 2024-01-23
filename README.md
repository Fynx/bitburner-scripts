# bitburner scripts

```sh
expand.js
```
For exploring and getting access automatically on servers. Note that backdooring and downloading interesting files may still have to be done manually. Simply fire `run expand.js`. Currently does some coding contracts as well.

```sh
manager.js
```
For running hacking on servers. Runs `scheduler.js` processes for each target host and then finishes.

```sh
server_mgmt.js
```
For buying or upgrading servers in a more or less civilised way. Set your own server name prefix and then run `run server_mgmt.js buy s` or `run server_mgmt.js upgrade s old_server_name`.

```sh
info.js server
```
For server details.


## Configuration

Copy all the files from repository. Can be done with scp.

Set up configuration in `manager.js`. Most importantly insert names of your servers on your selected target hosts. Yes, you can use multiple servers as a cluster, but somehow it doesn't meet the expectations and I'm out of steam. Test at your own leisure.

If your servers do not have enough RAM, algorithm won't be working properly. Thread numbers are adjusted to exactly half of the money on the servers.


## Run manager.js

`run manager.js all --cleanup`
to ensure all target hosts have minimal security and maximal money, which is required for the algorithm to work properly.

`run manager.js all`
to run schedulers for all target hosts. Each scheduler takes up `6.60GB`, while `manager.js` takes up `2.60GB`. The algorithm takes a bit of time to get the money moving on servers with longer routine times.

`run manager.js n00dles`
just the n00dles.

`run manager.js all --without n00dles`
except the n00dles.

`run manager.js n00dles --debug`
creates a lot of spam in the terminal. Replace all `tprintf` with `printf` to move it to log window at your leisure.


## Inner workings of manager.js

I simply rely on the fact that running a set of

`hack -> weaken -> grow -> weaken`

so they end in this order in a very short time, allows to run a LOT of such sets concurrently without security and available money loss.

That provides a constant high RAM usage and, naturally, stable money and exp income.
