# wat to do, wat to do

For development, run this:

```
pnpm i
```

Then go to `svelte.config.js` and comment out the following line as well as the line that uses the `preprocessor` variable:
```
import { preprocessor } from 'apparitions/preprocessor';
```

In a side terminal:

```
pnpm package --watch
```

Uncomment these lines back. Yeah, it sucks, you only have to do it once, get over it.

In the main terminal:

```
pnpm link ./package
pnpm dev
```

Since the preprocessor only runs on start and code changes in the actual application, get used to killing `pnpm dev` and starting it again to see the changes in the preprocessor pull up. 
