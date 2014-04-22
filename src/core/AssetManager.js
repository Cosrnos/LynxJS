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

Lynx.AssetManager = (function () {
	var that = new Lynx.Object();

	var queue = [];
	var assets = [];
	var processing = false;
	var queueFinishCallback = function () {};

	/**
	 * Description: Gets the asset by name
	 *
	 * @this {Lynx.AssetManager}
	 * @param {String} <pName> The name of the desired asset.
	 * @return {Lynx.Asset || bool} Returns the asset or false if not found
	 */
	that.Get = function (pName) {
		for (var i in assets) {
			var a = assets[i];
			if (a.Name == pName) {
				return a;
			}
		}

		//Not found
		return false;
	};

	/**
	 * Description: Whether the asset manager already has an asset with the given name
	 *
	 * @this {Lynx.AssetManager}
	 * @param {String} <pName> The given name to search for
	 * @return {bool} True if queue or assets has an asset with pName
	 */
	that.Contains = function (pName) {
		var found = false;
		for (var i in assets) {
			if (assets[i].Name == pName) {
				found = true;
				break;
			}
		}

		if (!found) {
			for (var ii in queue) {
				if (queue[ii].Name == pName) {
					found = true;
					break;
				}
			}
		}

		return found;
	};

	/**
	 * Description: Adds an asset to the loading queue
	 *
	 * @this {Lynx.AssetManager}
	 * @param {Lynx.Asset} <pAsset> The asset to add to the queue
	 */
	that.Queue = function (pAsset) {
		if (!this.Contains(pAsset.Name) && !processing) {
			queue.push(pAsset);
		}
	};

	/**
	 * Description: Adds the given image to the loading queue
	 *
	 * @this {Lynx.AssetManager}
	 * @param {String} <pName> Asset Name/Reference
	 * @param {String} <pFilepath> Location of the asset relative to the working directory
	 */
	that.QueueImage = function (pName, pFilepath) {

		if (typeof pFilepath === 'undefined' || pFilepath === "") {
			pFilepath = pName;
		}

		var asset = new Lynx.Asset();
		asset.Name = pName;
		asset.Filepath = pFilepath;
		asset.Type = "img";

		this.Queue(asset);
	};

	/**
	 * Description: Adds the given audio to the loading queue
	 *
	 * @this {Lynx.AssetManager}
	 * @param {String} <pPath> Location of the asset relative to the working directory
	 */
	that.QueueAudio = function (pName, pFilepath) {
		if (typeof pFilepath === 'undefined' || pFilepath === "") {
			pFilepath = pName;
		}

		var asset = new Lynx.Asset();
		asset.Name = pName;
		asset.Filepath = pFilepath;
		asset.Type = "audio";

		this.Queue(asset);
	};

	/**
	 * Description: Adds the given video to the loading queue
	 *
	 * @this {Lynx.AssetManager}
	 * @param {String} <pPath> Location of the asset relative to the working directory
	 */
	that.QueueVideo = function (pName, pFilepath) {
		if (typeof pFilepath === 'undefined' || pFilepath === "") {
			pFilepath = pName;
		}

		var asset = new Lynx.Asset();
		asset.Name = pName;
		asset.Filepath = pFilepath;
		asset.Type = "video";

		this.Queue(asset);
	};

	/**
	 * Description: Adds the given JSON file to the loading queue
	 *
	 * @this {Lynx.AssetManager}
	 * @param {String} <pPath> Location of the asset relative to the working directory
	 */
	that.QueueJSON = function (pName, pFilepath) {
		if (typeof pFilepath === 'undefined' || pFilepath === "") {
			pFilepath = pName;
		}

		var asset = new Lynx.Asset();
		asset.Name = pName;
		asset.Filepath = pFilepath;
		asset.Type = "json";

		this.Queue(asset);
	};

	/**
	 * Description: Loads all assets in the queue
	 *    This code is blocking and will not allow anymore assets to be loaded until the
	 *    current queue is finished processing.
	 *
	 * @this {Lynx.AssetManager}
	 * @param {Callback} <pCallback> Callback to be executed when all Assets have been loaded
	 */
	that.LoadQueue = function (pCallback) {
		if (processing || queue.length <= 0) {
			return;
		}

		processing = true;

		for (var x = 0; x < queue.length; x++) {
			var i = queue[x];
			switch (i.Type) {
			case "img":
				var img = new Image();

				img.addEventListener("load", (function () {
					queueCallback(this);
				}).bind(i), false);

				img.src = i.Filepath;
				i.Asset = img;
				break;
			case "audio":
				var audio = new Audio();

				audio.addEventListener("canplaythrough", (function () {
					queueCallback(this);
				}).bind(i), false);

				audio.src = i.Filepath;
				i.Asset = audio;
				break;
			case "video":
				var video = new Video();

				video.addEventListener("canplay", (function () {
					queueCallback(this);
				}).bind(i), false);

				video.src = i.Filepath;
				i.Asset = video;
				break;
			case "json":
				var client = new XMLHttpRequest();
				client.open('get', i.Filepath);
				client.addEventListener("readystatechange", (function () {
					if (client.status == 200 && client.responseText != "") {
						this.Asset = JSON.parse(client.responseText);
						queueCallback(this)
					}
				}).bind(i));
				client.send();
				break;
			default:
				//No idea what this is, so we'll treat it as a file
				//Probably not the best but it works for now ~Cosrnos
				var client = new XMLHttpRequest();
				client.open('GET', i.Filepath);
				client.addEventListener("readystatechange", (function () {
					queueCallback(this);
				}).bind(i), false);
				client.send();
				break;
			}
		}

		queueFinishCallback = pCallback;
	}

	/**
	 * Description: Counts the amount of items in the current queue
	 *
	 * @this {Lynx.AssetManager}
	 * @return {int} Amount of items to be loaded
	 */
	that.QueueCount = function () {
		return queue.length;
	};

	/**
	 * Description: Whether the Asset Manager is loading items or not
	 *
	 * @this {Lynx.AssetManager}
	 * @return {bool} True if loading assets.
	 */
	Object.defineProperty(that, "IsProcessing", {
		get: function () {
			return processing;
		}
	});

	/**
	 * Description: Called once an asset has been loaded and checks if all assets have been loaded
	 *
	 * @internal
	 * @this {Lynx.AssetManager}
	 * @param {Lynx.Asset} <pAsset> The asset that has just finished loading
	 */
	function queueCallback(pAsset) {
		if (pAsset.Status > 0) {
			return;
		}

		if (queue.indexOf(pAsset) > -1) {
			queue.splice(queue.indexOf(pAsset), 1);
			pAsset.Status = 1;

			assets.push(pAsset);
		}

		if (queue.length === 0) {
			processing = false;
			Lynx.Emit("AssetManager.Queue.Finished", this);
			queueFinishCallback();
		}
	}

	return that;
})();

/**
 * Description: A loadable asset used by Lynx
 *
 * @object
 * @this {Lynx.Asset}
 */
Lynx.Asset = function () {
	return {
		Name: "",
		Filepath: "",
		Type: "",
		Asset: null,
		Status: 0
	};
};

Lynx.AM = Lynx.AssetManager;
