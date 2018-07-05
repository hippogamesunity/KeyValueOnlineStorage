using UnityEngine;
using UnityEngine.UI;

namespace Assets.KeyValueOnlineStorage
{
	/// <summary>
	/// Key-Value service usage example.
	/// </summary>
	public class Example : MonoBehaviour
	{
		public InputField Input;
		public Text Key;
		public InputField Output;
		public Button GetButton;

		/// <summary>
		/// Save value example.
		/// </summary>
		public void Set()
		{
			KeyValueService.SetValueAsync(Input.text, (success, result) =>
			{
				if (success)
				{
					Key.text = result;
					GetButton.interactable = true;
				}
				else
				{
					Debug.LogError(result);
				}
			});
		}

		/// <summary>
		/// Get value example.
		/// </summary>
		public void Get()
		{
			KeyValueService.GetValueAsync(Key.text, (success, result) =>
			{
				if (success)
				{
					if (string.IsNullOrEmpty(result))
					{
						Output.text = "Key not found. It may be deleted when storage cleanup.";
					}
					else
					{
						Output.text = result;
					}
				}
				else
				{
					Debug.LogError(result);
				}
			});
		}

		/// <summary>
		/// Write a review on the Asset Store.
		/// </summary>
		public void Feedback()
		{
			Application.OpenURL("https://www.assetstore.unity3d.com/#!/content/122286");
		}
	}
}