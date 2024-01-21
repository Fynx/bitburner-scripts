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
get_info.js server
```
For server details.


## Configuration

Copy all the files from repository.

Set up configuration in `manager.js`. Most notably, insert names of your servers on your selected target hosts. Yes, you can use multiple servers as a cluster, but somehow it doesn't meet the expectations and I'm out of steam. Test at your own leisure.

If your servers do not have enough RAM, algorithm won't be working properly. I tested this only on petabyte servers, but anything starting from 1 TB with low enough thread multiplier parameter should work.

The one other parameter you might want to fine-tune is thread multiplier. Especially if you're running this on small-ish servers. Explanation lower.


## Run manager.js

`run manager.js all --cleanup`
to ensure all target hosts have minimal security and maximal money, which is required for the algorithm to work properly.

`run manager.js all`
to run schedulers for all target hosts. Each scheduler takes up `3.85GB`, while `manager.js` takes up `2.90GB`. The algorithm takes a bit of time to get the money moving on servers with longer routine times.

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


### Parameters

The number of threads for each operation can be determined with formulas API. However, I was too lazy for that and the exact values have to be adjusted manually.

	thread-mult - global multiplier for number of all threads
	grow-mult - number of threads used for grow operation
	weaken-mult - number of threads used for weaken operation

Scheduler also allows `hack-mult` as parameter, if you feel like using it.

Fortunately, the default values work pretty well, so in the worst case you might just want to lower `thread-mult` parameter.


### thread multiplier

If the value of `thread-mult` is too low, the scheduler won't manage to start up enough processes at once to fully utilise RAM.

On the other hand if the value of `thread-mult` is too high, RAM usage will experience high drops and the money and exp income won't be as stable.

In other words, the smallest `thread-mult` that utilises maximal possible RAM is the optimum.


### Other

> I'm getting weird warnings in scheduler logs!

Since the scheduler needs to reserve RAM for running specific routines for a full set at a later time, some part of RAM memory is left unused.
This is compensated by "borrowing" from future sets by artificially assuming additional 10% of actual RAM. In case a process can't be run due to RAM shortage, a waiting loop is run and the next scheduling is pushed forward to compensate.

> Why is there only one `weaken-mult` parameter when it's run twice in each set?!

Because I'm a lazy bum. Do it yourself.
