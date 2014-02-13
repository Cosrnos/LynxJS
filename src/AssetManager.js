/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: AssetManager.js
*    Description: The component loader/manager for lynx
*    Note: Is this really necesarry? Consider moving into core.
*    Global Variables: Lynx.ComponentManager{}, Lynx.CM{}
*/

Lynx.AssetManager = (function(){
	var that = new Lynx.Object();

	var queue = [];
	var assets = [];
	var processing = false;
	var queueFinishCallback = function(){ };

	that.Get = function(pName)
	{
		for(var i in assets)
		{
			var a = assets[i];
			if(a.Name == pName)
				return a;
		}

		//Not found
		return false;
	}

	that.Contains = function(pName)
	{
		var found = false;
		for(var i in assets)
		{
			if(assets[i].Name == pName)
			{
				found = true;
				break;
			}
		}

		if(!found)
		{
			for(var i in queue)
			{
				if(queue[i].Name == pName)
				{
					found = true;
					break;
				}
			}
		}

		return found;
	}

	that.Queue = function(pAsset)
	{
		if(!this.Contains(pAsset))
			queue.push(pAsset);
	}

	that.QueueImage = function(pName, pFilepath)
	{

		if(typeof pFilepath == 'undefined' || pFilepath == "")
			pFilepath = pName;

		var asset = new Lynx.Asset;
		asset.Name = pName;
		asset.Filepath = pFilepath;
		asset.Type = "img";

		this.Queue(asset);
	}

	that.QueueAudio = function(pPath)
	{
		return;
	}

	that.QueueVideo = function(pPath)
	{
		return;
	}

	//Please note that only one queue may be loaded
	//at one time. THIS IS BLOCKING.
	that.LoadQueue = function(pCallback)
	{
		if(processing)
			return;

		processing = true;

		for(var x in queue)
		{
			var i = queue[x];
			switch(i.Type)
			{
				case "img":
					var img = new Image();
					
					img.addEventListener("load",function(){
						queueCallback(i);
					}, false);

					img.src = i.Filepath;
					i.Asset = img;
					break;
				case "audio":
					var audio = new Audio();

					audio.addEventListener("canplaythrough", function(){
						queueCallback(i);
					}, false);

					audio.src = i.Filepath;
					i.Asset = audio;
					break;
				case "video":
					var video = new Video();

					video.addEventListener("canplaythrough", function(){
						queueCallback(i);
					}, false);

					video.src = i.Filepath;
					i.Asset = video;
					break;
				default:
					//No idea what this is, so we'll treat it as a file
					//Probably not the best but it works for now ~Cosrnos
					var client = new XMLHttpRequest();
					client.open('GET', i.Filepath);
					client.addEventListener("readystatechange", function(){
						queueCallback(i);
					}, false);
					client.send();
					break;
			}
		}

		queueFinishCallback = pCallback;
	}

	that.QueueCount = function()
	{
		return queue.length;
	}

	that.IsProcessing = function() { return processing; };

	function queueCallback(pAsset)
	{
		if(queue.indexOf(pAsset) > -1)
		{
			queue.splice(queue.indexOf(pAsset), 1);
			pAsset.Status = 1;

			assets.push(pAsset);
		}

		if(queue.length == 0)
		{
			processing = false;
			Lynx.Emit("AssetManager.Queue.Finished", this);
			queueFinishCallback();
		}
		else
			Lynx.Log(queue.length);
	}

	return that;
})();

Lynx.Asset = function(){ 
	return {
		Name: "",
		Filepath: "",
		Type: "", //TODO: 'Enum' for this
		Asset: null,
		Status: 0 //TODO: 'Enum' for this
	};
}

Lynx.AM = Lynx.AssetManager;
