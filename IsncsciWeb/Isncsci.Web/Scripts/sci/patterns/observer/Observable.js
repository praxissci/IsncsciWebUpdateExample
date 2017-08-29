/*--------------------------------------------------------------------------
	@class common.patterns.observer.Observable
	@author Eduardo Echeverria http://www.eddiemachete.com/
	@version 1.0 November 26, 2009
  --------------------------------------------------------------------------
*/
sci.Provide('sci.patterns.observer.Observable');


/**
 * Constructor
*/
sci.patterns.observer.Observable = function () {
    this.Events = new Array();
};

/**
 * Notifies all the observers associated to a particular event.
 * @param {e} Event to be broadcasted.
 * @private
*/
sci.patterns.observer.Observable.prototype.UpdateObservers = function (e) {
    var items = this.Events["e_" + e.Type];

    if (items) {
        e.Sender = this;

        for (var i = 0; i < items.length; i++) {
            var observer = items[i].Observer;
            var handler = items[i].HandlerName;
            observer[handler].apply(observer, [e]);
        }
    }
};

/**
 * Adds an object as a listener of the event specified by the string eventName.
 * @param {eventName} Name of the event the observer will be linked to.
 * @param {observer} Object observing for the event.
*/
sci.patterns.observer.Observable.prototype.AddObserver = function (eventName, observer, handlerName) {
    var key = "e_" + eventName;

    if (this.Events[key]) {
        var isObserver = false;
        var observers = this.Events[key];
        var index = 0;

        while (index < observers.length && !isObserver) {
            if (observers[index].Observer == observer) { isObserver = true; }
            index++;
        }

        if (!isObserver) { this.Events[key].push({ Observer: observer, HandlerName: handlerName ? handlerName : eventName }); }
    }
    else {
        this.Events[key] = new Array();
        this.Events[key].push({ Observer: observer, HandlerName: handlerName ? handlerName : eventName });
    }
};

/**
 * Removes an object as an observer of the event specified by the string eventName.
 * @param {eventName} Name of the event the object will stop observing.
 * @param {observer} Observer.
*/
sci.patterns.observer.Observable.prototype.RemoveObserver = function (eventName, observer) {
    var key = "e_" + eventName;
    var observers = this.Events[key];

    if (observers) {
        var found = false;
        var index = 0;

        while (index < observers.length && !found) {
            if (observers[index].Observer == observer) {
                observers.splice(index, 1);
                found = true;
            }

            index++;
        }
    }
};

/**
 * Clears all the observers of the object.
*/
sci.patterns.observer.Observable.prototype.ResetObservers = function () {
    delete this.Events;
    this.Events = new Array();
};

sci.patterns.observer.Observable.prototype.toString = function () {
    var s = "Object Type: Observable\n";

    for (var index in this.Events) {
        s += index + " - " + this.Events[index].length + " observers";
    }

    return (s);
};

sci.Ready('sci.patterns.observer.Observable');