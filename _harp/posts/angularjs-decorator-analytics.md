Angularjs decorator for analytics
==================================
I love analytics when I can look at the result, while I hate it when they look over what I do. And I also hate it when they poison my controllers just to save a goddam click.
Our goal here will be to implement it in a way you save whatever event you want, without polluting your services, controllers & directives. In this example, let's use the angular-google-analytics library (wrapper actually :) ) just because if it exists and is complete enough for your use, profit !

To do so, there is an under-used functionnality of nG which is the decorator. The idea of a decorator is to encapsulate a previous service, directive or provider which another logic. Bonux, it can hook "before" or "after" the function. It simple limitation being that it should be configured through the $provide provider, which normally mean it will be in the config block. Which means we can't use service but only providers.

Fuck that. Let's declare a service for our analytics.
```
```

Cool, we got our event handlers, now let's declare our generic listeners.

Here, we want to look over the primitives directives for clicks : we're gonna register the [a [href||ui-sref]] and every ng-click event : that way we're catching pretty much every " voluntary interaction". We 're still missing the "discovering events" as of mouseover, but let's look after that later.
```
```
We also add a page tracking, disabling everything from the plugin and handle manually. The reason is to avoid having some

Here, that's the provide story we're actually missing : simply enough, it's not accessible "here", but it doesn't mean we can't export it for our module block. The reason we do that is to be able to "modulate" our app, and being able to easily inject our services (which are not accessible in conf) into the app global module.

Cool enough, every click is sent to our analytics system. Problem is, if we look hover the GA analytics, we'd like to be able to see a conversion rate, see where it drops & so on. There is 2 ways to define a "goal" (GA terminology) : either by click or by a succession of page change. Problem is, a click can define the end of a goal, but it doesn't give you information on the way your app have been used. But the page change does. So let's consider some "click" event as the end of a goal and send a "virtual page" change, a fake page which will consider the goal have been fulfilled.

Now, we need to register this to our precious button of validation. I haven't found a proper & clean solution yet for this one, so let's make it "works" so far : we declare our element by name (or id, as you wish to pollute your DOM :D ) and upon rendering, just check if it's one of those we're looking for and attach (or not) the event to it :
```
```
To avoid checking twice, we also remove it from our >copy< of the element declaration, this way if you got multiple by page, it avoid to loop for nothing once it's registered.

Another solution would be to actually declare another directive to directly "choose" the goal ender. It IS definetely cleaner, but my goal was to not touch my DOM at all, so you can still decorate the specific directive that use this goal ender (for example, on angular-material, mdButton) to reduce the scope of potential element to loop hover.

In case you do some back-end specific check, when clicking the "end" button doesn't define the success of your scenario, you may be interested in extending $q or $http to add your event of end of goal in the "success" callback ;)

That's it so far, the event is easily extendable, so are the targets, and you can track what's really important : your user workflow and your real conversions, without putting some analytics code everywhere.

> #my2cents
