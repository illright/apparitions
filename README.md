# wat to do, wat to do

For development, run this:

```
pnpm i
```

In a side terminal:

```
pnpm package --watch
```

In the main terminal:

```
pnpm link ./package
pnpm dev
```

Since the preprocessor only runs on start and code changes in the actual application, get used to killing `pnpm dev` and starting it again to see the changes in the preprocessor pull up. 
