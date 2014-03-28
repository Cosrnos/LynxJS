/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Matrix.js
*    Description: A matrix used in webgl
*    Global Variables: Lynx.Matrix, Lynx.M
*/

Lynx.Matrix = function(pColumns, pRows, pType)
{
	var that = {};

	that.Type = pType || "int";

	that.ColumnCount = pColumns;
	that.RowCount = pRows;

	var data = [];
	
	that.Build = function(){
		for(var i = 0; i < that.RowCount; i++)
		{
			if(typeof data[i] == 'undefined')
				data[i] = [];

			for(var x = 0; x < that.ColumnCount; x++)
			{
				var filler = 0;
				//If type == "object" filler = {}
				data[i][x] = filler;
			}
		}
	}

	that.Get = function(pRow, pColumn)
	{
		if(typeof data[pRow] != 'undefined')
		{
			if(typeof data[pRow][pColumn] != 'undefined')
			{
				return data[pRow][pColun];
			}
		}

		Lynx.Error("Could not fetch Matrix data from cell ["+pRow+","+pColumn+"] as it is undefined.");
		return false;
	}

	that.Set = function(pRow, pColumn, pValue)
	{
		if(typeof data[pRow] != 'undefined')
		{
			if(typeof data[pRow][pColumn] != 'undefined')
			{
				data[pRow][pColun] = pValue;
			}
		}

		Lynx.Error("Could not set Matrix data to cell ["+pRow+","+pColumn+"] as it is undefined.");
		return false;
	}

	that.Translate = function()
	{
		if(arguments.length > that.ColumnCount)
			return false;

		for(var i = 0; i < that.RowCount; i++)
		{
			if(typeof data[i] == 'undefined')
				data[i] = [];

			for(var x = 0; x < that.ColumnCount; x++)
			{
				var pos = x;
				if(x > arguments.length)
					pos = 0;

				data[i][x] += arguments[pos];
			}
		}
	}

	that.Multiply = function()
	{
		if(arguments.length > that.ColumnCount)
			return false;

		for(var i = 0; i < that.RowCount; i++)
		{
			if(typeof data[i] == 'undefined')
				data[i] = [];

			for(var x = 0; x < that.ColumnCount; x++)
			{
				var pos = x;
				if(x > arguments.length)
					pos = 0;

				data[i][x] *= arguments[pos];
			}
		}
	}

	that.Inverse = function()
	{
		if(arguments.length > that.ColumnCount)
			return false;

		for(var i = 0; i < that.RowCount; i++)
		{
			if(typeof data[i] == 'undefined')
				data[i] = [];

			for(var x = 0; x < that.ColumnCount; x++)
			{
				var pos = x;
				if(x > arguments.length)
					pos = 0;

				data[i][x] /= arguments[pos];
			}
		}
	}

	that.Build();

	return that;
}
