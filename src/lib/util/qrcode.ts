import QRCode from "qrcode"

const generateQR = async (text: string) => {
  try {
    return await QRCode.toDataURL(text)
  } catch (err) {
    console.error(err)
    return null
  }
}

const downloadQR = (qrURL: string) => {
  // Create a temporary link element to trigger the download
  const link = document.createElement("a")
  link.href = qrURL
  link.setAttribute("download", "qrcode.png") // Set the default file name

  // Append link to the body, click it, and then remove it
  document.body.appendChild(link)
  link.click()
  link.parentNode?.removeChild(link)
}

export { generateQR, downloadQR }
