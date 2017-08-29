/*--------------------------------------------------------------------------
	@class sci.SciBootstrap
	@author Eduardo Echeverria http://www.eddiemachete.com/
	@version 1.0 November 26, 2009
  --------------------------------------------------------------------------
*/
var sci = sci || new SciBootstrap();
sci.SetGlobal(this); // Reference to the object loading the script.  Most of the time it is the window.
sci.SetDebug(false);

function SciBootstrap()
{
	var m_global = null;
	var m_debug = true;
	var m_implicitNamespaces = {};
	var m_included = {}; // Used to keep track of urls that have already been added preventing circular dependencies.
	var m_basePath = '/Scripts/';
	var m_readyListeners = new Array();
	var m_complete = false;
	var m_inherits = new Array();
	var m_compiledMode = false;
	
	// This object is used to keep track of dependencies and other data that is used for loading scripts
	var m_dependencies = {
			PathToNames: new Object(),	// 1 to many
			NameToPath: new Object(),	// 1 to 1
//			Requires: new Object(),		// 1 to many
//			Visited: new Object(),		// used when resolving dependencies to prevent us from visiting the file twice
			Written: new Object(),		// used to keep track of script files we have written
			Ready: new Object()         // used to keep track of script files where the code has been initialized.  Important when extending classes.
		};
	
	this.GetGlobal = function()
	{
		return m_global;
	}
	
	this.SetGlobal = function(v)
	{
		m_global = v;
	}
	
	this.GetDebug = function()
	{
		return m_debug;
	}
	
	this.SetDebug = function(v)
	{
		m_debug = v;
	}
	
	this.GetBasePath = function()
	{
    	return m_basePath;
	}
	
	this.SetBasePath = function(v)
	{
	    m_basePath = v;
	}

	this.GetCompiledMode = function()
	{
	    return m_compiledMode;
	}
	
	this.SetCompiledMode = function(v)
	{
	    m_compiledMode = v;
	}
	
	this.AddReadyListener = AddReadyListener;
	this.GetPathFromDependencies = GetPathFromDependencies;
	this.Require = Require;
	this.GetObjectByName = GetObjectByName;
	this.Provide = Provide;
	this.Ready = Ready;
	this.Inherits = Inherits;
	this.InheritsFromClass = InheritsFromClass;

	/**
	* Adds an object to the Ready Listeners list which will be notified once all the required scripts are loaded.
	* The listener must have a method handler called SciReady otherwise an exeption will be trhown.
	* @param {object} Listener object which will be notified once all scripts are loaded.
	*/
	function AddReadyListener(listener)
	{
		if (listener.SciReady)
		{
			m_readyListeners.push(listener);
		}
		else
		{
			throw Error('Assigned ready listener "' + listener.toString() + '" does not contain a definition for listener method SciReady');
		}
	}
	
	/**
	* Creates object stubs for a namespace.
	* @param {string} name name of the object that this file defines.
	*/
	function Provide(name)
	{
		if (GetObjectByName(name) && !m_implicitNamespaces[name])
		{
			throw Error('Namespace "' + name + '" has been declared already.');
		}
		
		var namespace = name;
		
		while ((namespace = namespace.substring(0, namespace.lastIndexOf('.'))))
		{
			m_implicitNamespaces[namespace] = true;
		}
		
		ExportPath(name);
		var path = ConvertNameToPath(name);

		if (!(path in m_dependencies.PathToNames))
		{
			m_dependencies.PathToNames[path] = new Object();
		}

		m_dependencies.NameToPath[name] = path;
		m_dependencies.PathToNames[path][name] = true;
		m_dependencies.Written[name] = true;
		//CheckIfComplete();
	}

	/**
	 * Returns an object based on its fully qualified external name.
	 * @param {string} name The fully qualified name.
	 * @param {Object} target The object within which to look; default is
	 *     |Bootstrap.Global|.
	 * @return {Object?} The object or, if not found, null.
	 */
	function GetObjectByName(name, opt_target)
	{
		var parts = name.split('.');
		var current = opt_target || m_global;
		
		while (parts.length && current)
		{
			current = current[parts.shift()];
		}

	  	return current;
	}
	
	this.toString = function()
	{
		return '[Class::Bootstrap]';
	}

	/**
	 * Builds an object structure for the provided namespace path,
	 * ensuring that names that already exist are not overwritten. For
	 * example:
	 * "a.b.c" -> a = {};a.b={};a.b.c={};
	 * Used by Bootstrap.Provide and Bootstrap.ExportSymbol.
	 * @param {string} name name of the object that this file defines.
	 * @param {Object} opt_object the object to expose at the end of the path.
	 * @param {Object} opt_objectToExportTo The object to add the path to; default
	 *     is |Bootstrap.Global|.
	 * @private
	 */
	function ExportPath(name, opt_object, opt_objectToExportTo)
	{
		var parts = name.split('.');
		var current = opt_objectToExportTo || m_global;
		
		// Internet Explorer exhibits strange behavior when throwing errors from
		// methods externed in this manner.  See the testExportSymbolExceptions in
		// base_test.html for an example.
		if (!(parts[0] in current) && current.execScript)
		{
			current.execScript('var ' + parts[0]);
		}

		// Parentheses added to eliminate strict JS warning in Firefox.
		for (var part; parts.length && (part = parts.shift());)
		{
			if (!parts.length && IsDefined(opt_object))
			{
				// last part and we have an object; use it
				current[part] = opt_object;
			}
			else if (current[part])
			{
				current = current[part];
			}
			else
			{
				current = current[part] = {};
			}
		}
	}
	
	/**
	 * Returns true if the specified value is not |undefined|.
	 * WARNING: Do not use this to test if an object has a property. Use the in
	 * operator instead.  Additionally, this function assumes that the global
	 * undefined variable has not been redefined.
	 * @param {*} val Variable to test.
	 * @return {boolean} Whether variable is defined.
	 * @private
	 */
	function IsDefined(val)
	{
  		return val !== undefined;
	}
	 
	/**
	 * Implements a system for the dynamic resolution of dependencies
	 * that works in parallel with the BUILD system.
	 * @param {string} rule Rule to include, in the form sci.package.part.
	 */
	function Require(rule)
	{
		if (!GetObjectByName(rule) && !(rule in m_dependencies.Written))
		{
			var src = ConvertNameToPath(rule);
			m_dependencies.Written[rule] = false;
			m_dependencies.Ready[rule] = false;
			m_complete = false;
			
			if (!m_compiledMode && InHtmlDocument())
			{
				var s = m_global.document.createElement('script');
				s.setAttribute('type', 'text/javascript');
				s.setAttribute('src', m_basePath + src);
				m_global.document.getElementsByTagName('head')[0].appendChild(s);
			}
		}
	}
	 
	/**
	 * Notifies the bootstrap that the code has been read by the browser and is ready to be used.
	 * This is of uttermost importance when extending classes to ensure that the prototypes have been initialized.
	 * @param {string} rule Rule to include, in the form sci.package.part.
	 */
	function Ready(rule)
	{
	    if (rule in m_dependencies.Ready)
	    {
		    m_dependencies.Ready[rule] = true;
		    CheckIfComplete();
		    
		    if (m_complete)
		    {
		        ApplyInherits();
		        NotifyReadyListeners();
		    }
		}
	}
	
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * Usage:
     * <pre>
     * function ParentClass(a, b) { }
     * ParentClass.prototype.foo = function(a) { }
     *
     * function ChildClass(a, b, c) {
     *   ParentClass.call(this, a, b);
     * }
     *
     * goog.inherits(ChildClass, ParentClass);
     *
     * var child = new ChildClass('a', 'b', 'see');
     * child.foo(); // works
     * </pre>
     *
     * In addition, a superclass' implementation of a method can be invoked
     * as follows:
     *
     * <pre>
     * ChildClass.prototype.foo = function(a) {
     *   ChildClass.superClass_.foo.call(this, a);
     *   // other code
     * };
     * </pre>
     *
     * @param {Function} childCtor Child class.
     * @param {Function} parentCtor Parent class.
    */
	function Inherits(childCtor, parentCtor) {
        /** @constructor */
        function tempCtor() {};

        // Prototype initialization which supports asynchronous class loading
        for (var m in parentCtor.prototype) {
            tempCtor.prototype[m] = parentCtor.prototype[m];
        }

        for (var m in childCtor.prototype) {
            tempCtor.prototype[m] = childCtor.prototype[m];
        }
        
        // This is how google does its inheritance but it ignores asynchronous loading
        //tempCtor.prototype = parentCtor.prototype;
        
        childCtor.superClass_ = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.constructor = childCtor;
    }
    
    function InheritsFromClass(childCtor, parentClass)
    {
        var parentCtor = GetObjectByName(parentClass);
        
        if (parentCtor)
        {
            Inherits(childCtor, parentCtor);
        }
        else
        {
            m_inherits.push({Parent:parentClass, Child:childCtor});
        }
    }
	
	/**
	 * Looks at the dependency rules and tries to determine the script file that
	 * fulfills a particular rule.
	 * @param {string} rule In the form goog.namespace.Class or project.script.
	 * @return {string?} Url corresponding to the rule, or null.
	 * @private
	 */
	 function GetPathFromDependencies(rule)
	 {
		 return (rule in m_dependencies.NameToPath)
		 	? m_dependencies.NameToPath[rule]
			: null;
	 }

	/**
	 * Tries to detect whether is in the context of an HTML document.
	 * @return {boolean} True if it looks like HTML document.
	 * @private
	 */
	 function InHtmlDocument()
	 {
		 var doc = m_global.document;
		 
		 return typeof doc != 'undefined' && 'write' in doc;
	 }
	 
	 /**
	 * Derives a file's url from it's namespace.
	 * @param {string} rule In the form goog.namespace.Class or project.script.
	 * @return {string} The path to a class document.
	 * @private
	 */
	 function ConvertNameToPath(name)
	 {
		 return name.replace(/\.|\\/g, '/') + '.js';
	 }
	 
	 /**
	 * Loops through the Written list dependencies to ensure all required files have been written.
	 * If so, the object set as listener to the ready event is notified.
	 * @private
	 */
	function CheckIfComplete()
	{
		m_complete = true;
		
		for (var name in m_dependencies.Ready)
		{
			if (!m_dependencies.Ready[name])
			{
				m_complete = false;
				return;
			}
		}
	}
	
	function NotifyReadyListeners()
	{
		if (m_complete)
		{
		    for (var i = 0; i < m_readyListeners.length; i++)
		    {
    		    m_readyListeners[i].SciReady({Target:this});
    		}
		}
	}
	
	function ApplyInherits()
	{
	    while (m_inherits.length > 0)
	    {
    	    var o = m_inherits.pop();
    	    Inherits(o.Child, GetObjectByName(o.Parent));
	    }
	}
}