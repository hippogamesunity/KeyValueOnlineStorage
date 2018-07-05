using System;
using UnityEngine;

namespace Assets.KeyValueOnlineStorage
{
	/// <summary>
	/// Provides access to key-value service.
	/// </summary>
	public static class KeyValueService
	{
		/// <summary>
		/// Service URL.
		/// </summary>
		private const string ServiceUrl = "https://script.google.com/macros/s/AKfycbyS_OIZA6MU4OkmWk2vWG9idLpPM1luqNkYgmsb17IH4ryZtKWw/exec";

		/// <summary>
		/// Save value on server and return a key in callback if succeeded (or error if not).
		/// </summary>
		public static void SetValueAsync(string value, Action<bool, string> callback)
		{
			Execute("set", value, callback);
		}

		/// <summary>
		/// Read value on server and return it in callback if succeeded (or error if not).
		/// </summary>
		public static void GetValueAsync(string key, Action<bool, string> callback)
		{
			Execute("get", key, callback);
		}

		private static void Execute(string method, string argument, Action<bool, string> callback)
		{
			var form = new WWWForm();

			form.AddField(method, argument);

			Downloader.Download(ServiceUrl, form, www =>
			{
				var success = www.error == null || www.error == "necessary data rewind wasn't possible"; // Redirect

				callback(success, www.text);
			});
		}
	}
}