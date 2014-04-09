/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: ShaderComponent.js
*    Description: A WebGL shader in scriptable format.
*    Global Variables: Lynx.Shader
*/

Lynx.ShaderComponent = function(pName, pType, pBuildFunc)
{
	var that = new Lynx.Object();

	that.Name = pName;
	that.Author = "";
	that.Type = null;

	/**
	* Description: A custom prefix to append to the beginning of the shader.
	*
	* @this {Lynx.ShaderComponent}
	*/
	that.Prefix = "";

	that.VariableType = {
		Attribute: "attribute",
		Uniform: "uniform",
		Varying: "varying"
	};

	if(pType == "vertex")
		that.Type = Lynx.Shaders.Type.Vertex;
	else if(pType == "fragment")
		that.Type = Lynx.Shaders.Type.Fragment;
	else
		return false;

	var variables = [];

	/**
	* Description: Adds the given attribute to the dynamic shader.
	*
	* @this {Lynx.ShaderComponent}
	* @param {string} <pType> The type of variable
	* @param {string} <pName> The name of the variable to add.
	*/
	that.Attribute = function(pType, pName)
	{
		addVar("attribute", pType, pName);
	}

	/**
	* Description: Adds the given uniform variable to the dynamic shader.
	*
	* @this {Lynx.ShaderComponent}
	* @param {string} <pType> The type of variable
	* @param {string} <pName> The name of the variable to add.
	*/
	that.Uniform = function(pType, pName)
	{
		addVar("uniform", pType, pName);
	}

	/**
	* Description: Adds the given varying variable to the dynamic shader.
	*
	* @this {Lynx.ShaderComponent}
	* @param {string} <pType> The type of variable
	* @param {string} <pName> The name of the variable to add.
	*/
	that.Varying = function(pType, pName)
	{
		addVar("varying", pType, pName);
	}

	/**
	* Description: Returns the main method of the dynamic shader
	*
	* @this {Lynx.ShaderComponent}
	*/
	that.Main = function()
	{
		return "";
	};

	/**
	* Description: Returns the variable with the given name
	*
	* @this {Lynx.ShaderComponent}
	* @param {string} <pName> The name of the variable to get
	* @return {this.Variable{}|bool} the variable object or false if not found. 
	*/
	that.GetVariable = function(pName, pType)
	{
		for(var i = 0; i < variables.length; i++)
		{
			if(variables[i].Name == pName && variables[i].DataType.toUpperCase() == pType.toUpperCase())
				return variables[i];
		}

		return false;
	}

	/**
	* Description: returns the precompiled shader
	*
	* @this {Lynx.ShaderComponent}
	* @return {string} the full shader text
	*/
	that.Compile = (function(){
		var toReturn = [];

		if(that.Prefix != "")
			toReturn.push(that.Prefix);

		for(var i = 0; i < variables.length; i++)
			toReturn.push(variables[i].DataType + " " + variables[i].Type + " " +variables[i].DataType.charAt(0)+"_"+variables[i].Name+";");

		toReturn.push("void main(void){");
		toReturn.push(this.Main.bind(this)());
		toReturn.push("}");

		return toReturn.join("\n");
	}).bind(that);

	/**
	* Description: Populates the locations of each variable in the given program.
	*
	* @this {Lynx.ShaderComponent}
	* @param {WebGLContext} <pGl> The canvas gl context
	* @param {WebGLProgram} <pProgram> The program the variables lie in
	*/
	that.GetLocations = function(pGl, pProgram)
	{
		for(var v = 0; v < variables.length; v++)
		{
			switch(variables[v].DataType)
			{
				case that.VariableType.Uniform:
					variables[v].Location = pGl.getUniformLocation(pProgram, "u_"+variables[v].Name);
					break;
				case that.VariableType.Attribute:
					variables[v].Location = pGl.getAttribLocation(pProgram, "a_"+variables[v].Name);
					break;
				default:
					break;
			}
		}
	}

	/**
	* Description: Adds a variable to the component.
	*
	* @internal
	* @this {Lynx.ShaderComponent}
	* @param {string} <pAUV> Uniform, attribute or Varying
	* @param {string} <pType> The type of variable
	* @param {string} <pName> The name of the variable to add
	* @param {pType} <pValue> The value to assign to the variable
	*/
	function addVar(pAUV, pType, pName, pValue)
	{
		if(variables.indexOf(pName) != -1)
		{
			if(variables[variables.indexOf(pName)].DataType.toUpperCase() === pAUV.toUpperCase())
				return false;
		}

		switch(pAUV.toUpperCase())
		{
			case "ATTRIBUTE":
				pAUV = that.VariableType.Attribute;
				break;
			case "UNIFORM":
				pAUV = that.VariableType.Uniform;
				break;
			case "VARYING":
				pAUV = that.VariableType.Varying;
				break;
			default:
				return false; 
		}

		if(pValue == null)
		{
			switch(pType)
			{
				case "vec2":
					pValue = [0,0];
					break;
				case "vec3":
					pValue = [0,0,0];
					break;
				case "vec4":
					pValue = [0,0,0];
					break;
				case "int":
					pValue = 0;
					break;
			}
		}

		variables.push({
			Name: pName,
			Type: pType,
			DataType: pAUV,
			Value: pValue,
			Position: null
		});
	};

	pBuildFunc.apply(that);

	Lynx.Shaders.Add(that);

	return that;
}
