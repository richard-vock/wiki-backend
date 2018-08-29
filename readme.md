# ExpressJS Wiki Backend

Backend service based on ExpressJS which maps CRUD REST queries to FS operations in a local git repository.

Note that while I use this in production, this service contains *no authentication/authorization* whatsoever. I run this in a tinc-based VPN with a firewall dropping anything but VPN packages (and SSH).

In case you want to use this in any (semi-)open network you should add an auth mechanism (e.g. using JWTs) - especially since this service maps HTTP requests to FS operations with close to no validity checks.

