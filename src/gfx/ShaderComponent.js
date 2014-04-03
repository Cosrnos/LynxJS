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

	that.Attribute = function(pType, pName)
	{
		addVar("attribute", pType, pName);
	}

	that.Uniform = function(pType, pName)
	{
		addVar("uniform", pType, pName);
	}

	that.Varying = function(pType, pName)
	{
		addVar("varying", pType, pName);
	}

	that.Main = function()
	{
		return "";
	};

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

	function addVar(pAUV, pType, pName, pValue)
	{
		if(variables.indexOf(pName) != -1)
			return false;

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
			}
		}

		variables.push({
			Name: pName,
			Type: pType,
			DataType: pAUV,
			Value: pValue
		});
	};

	pBuildFunc.apply(that);

	Lynx.Shaders.Add(that);

	return that;
}
