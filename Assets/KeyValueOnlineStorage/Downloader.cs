using System;
using System.Collections;
using UnityEngine;

namespace Assets.KeyValueOnlineStorage
{
    /// <summary>
    /// HTTP downloader.
    /// </summary>
    public class Downloader : MonoBehaviour
    {
	    public static bool EnableLogging = true;

        private static Downloader _instance;

        private static Downloader Instance
        {
            get { return _instance ?? (_instance = new GameObject("Downloader").AddComponent<Downloader>()); }
        }

        public void OnDestroy()
        {
            _instance = null;
        }

		/// <summary>
		/// Send POST request.
		/// </summary>
        public static void Download(string url, WWWForm form, Action<WWW> callback)
        {
	        Log("Downloading {0} with post data {1}", url, form);
            Instance.StartCoroutine(Coroutine(url, form, callback));
        }

        private static IEnumerator Coroutine(string url, WWWForm form, Action<WWW> callback)
        {
            var www = new WWW(url, form);

            yield return www;

	        Log("Downloaded {0}, www.text = {1}, www.error = {2}", url, CleaunupText(www.text), www.error);
			callback(www);
        }

	    private static string CleaunupText(string text)
	    {
		    return text.Replace("\n", " ").Replace("\t", null);
	    }

		private static void Log(string pattern, params object[] args)
	    {
		    if (EnableLogging)
		    {
			    Debug.LogFormat(pattern, args);
			}
		}
    }
}