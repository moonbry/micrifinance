import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

function PersonalLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    fomuNo: "",
    jinaKamiliLaMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    tareheYaKuzaliwa: "",
    ainaYaKitambulisho: "",
    nambaYaKitambulisho: "",
    nambaYaSimu: "",
    baruaPepe: "",
    uraia: "",
    haliYaNdoa: "",
    mahaliUnapoishiMkoa: "",
    mahaliUnapoishiWilaya: "",
    mahaliUnapoishiKata: "",
    mahaliUnapoishiMtaa: "",
    umilikiWaMakazi: "",
    umilikiWaMakaziMengine: "",
    nambaYaNyumba: "",
    umepanga: "",
    umeishiHapoTanguMiezi: "",
    jinaKamiliLaMumeMke: "",
    simuYaMumeMke: "",
    jinaMaarufuMtaani: "",
    ainaYaKitambulishoMumeMke: "",
    nambaYaKitambulishoMumeMke: "",
    kaziYaMumeMke: "",
    jinaLaMwajiriWaMumeMke: "",
    simuYaOfisiYaMumeMke: "",

    // SEHEMU 2: TAARIFA ZA AJIRA (UOMBIAJI)
    jinaLaKampuniYaMwajiri: "",
    anuaniYaOfisiYaMwajiri: "",
    wadhifa: "",
    tareheYaKuanzaKazi: "",
    mshaharaKwaMwezi: "",
    ainaYaAjira: "",
    tareheYaKumalizaMkataba: "",
    tareheYaKustaafu: "",

    // SEHEMU 3: TAARIFA ZA BIASHARA
    jinaLaBiashara: "",
    ainaYaBiashara: "",
    mahaliBiasharaIlipo: "",
    umefanyaBiasharaTanguLini: "",
    jinaMmilikiEneoBiashara: "",
    nambaSimuMmilikiEneo: "",
    wastaniKipatoKwaMwezi: "",
    mudaMkatabaEneoBiashara: "",
    wastaniMatumiziKwaMwezi: "",
    kiasiMkopo: "",
    kwaManeno: "",
    mudaKulipaMkopo: "",
    kwaTarakimu: "",
    kiasiRejeshoBilaMatatizo: "",
    malengoMkopo: "",
    chanzoMapato: "",
    historia1JinaTaasisi: "", historia1UlichukuaLini: "", historia1KiasiMkopo: "", historia1KiasiMarejesho: "", historia1TareheMarejesho: "", historia1KiasiKilichobaki: "",
    historia2JinaTaasisi: "", historia2UlichukuaLini: "", historia2KiasiMkopo: "", historia2KiasiMarejesho: "", historia2TareheMarejesho: "", historia2KiasiKilichobaki: "",
    historia3JinaTaasisi: "", historia3UlichukuaLini: "", historia3KiasiMkopo: "", historia3KiasiMarejesho: "", historia3TareheMarejesho: "", historia3KiasiKilichobaki: "",
    dhamanaAina: "", dhamanaNambaUsajili: "", dhamanaUmiliki: "", dhamanaThamaniKwaSasa: "", dhamanaMuonekano: "",
    wdhamini1JinaKamili: "", wdhamini1MahaliAnapoishi: "", wdhamini1AmepangaKwake: "", wdhamini1NambaNyumba: "", wdhamini1KaziAnayofanya: "", wdhamini1UhusianoWenu: "", wdhamini1MahaliOfisiYake: "", wdhamini1JinaKampuniBiashara: "", wdhamini1Simu: "",
    wdhamini2JinaKamili: "", wdhamini2MahaliAnapoishi: "", wdhamini2AmepangaKwake: "", wdhamini2NambaNyumba: "", wdhamini2KaziAnayofanya: "", wdhamini2UhusianoWenu: "", wdhamini2MahaliOfisiYake: "", wdhamini2JinaKampuniBiashara: "", wdhamini2Simu: "",
    tamkoLaMwombaji: false,
    tamkoMdhamini1: false,
    tamkoMdhamini2: false,
  });

  const steps = [
    "SEHEMU 1: TAARIFA ZA MWOMBAJI",
    "SEHEMU 2: TAARIFA ZA AJIRA",
    "SEHEMU 3: TAARIFA ZA BIASHARA",
    "SEHEMU 4: KIASI CHA MKOPO",
    "SEHEMU 5: HISTORIA YA MIKOPO",
    "SEHEMU 6: DHAMANA YA MKOPO",
    "SEHEMU 7: WADHAMINI NO.1",
    "SEHEMU 7: WADHAMINI NO.2",
    "PICHA YA PASSPORT",
    "TAMKO NA WASILISHA"
  ];

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.getElementById("navbar-portal"));
  }, []);

  const uploadPassportPhoto = async (): Promise<string | null> => {
    if (!passportPhoto) return null;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", passportPhoto);
      formData.append("applicant_name", form.jinaKamiliLaMwombaji);
      const res = await axios.post("http://127.0.0.1:8000/api/v1/upload/passport", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token ? `Bearer ${token}` : "" },
      });
      return res.data.photo_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tamkoLaMwombaji || !form.tamkoMdhamini1 || !form.tamkoMdhamini2) {
      alert("Tafadhali kubali tamko la mwombaji na wadhamini wote wawili");
      return;
    }
    if (!passportPhoto) {
      alert("Tafadhali pakia picha yako ya passport");
      return;
    }

    try {
      setLoading(true);
      let photoUrl = await uploadPassportPhoto() || "";
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliLaMwombaji,
        phone: form.nambaYaSimu,
        amount: form.kiasiMkopo,
        type: "personal",
        passport_photo: photoUrl,
        details: { ...form, passportPhotoUrl: photoUrl },
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      alert("OMBI LA MKOPO LIMEWASILISHWA KWA MAFANIKIO!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Imeshindwa kuwasilisha ombi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {portalTarget && createPortal(
        <div className="form-portal-content">
          <div className="fomu-no">
            <span style={{ color: '#64748b' }}>Fomu No:</span>
            <input type="text" name="fomuNo" value={form.fomuNo} onChange={handleChange} placeholder="........" className="fomu-no-input" />
          </div>
          <div className="step-indicators">
            {steps.map((_, idx) => (
              <button key={idx} type="button" className={`step-btn ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`} onClick={() => idx < currentStep && setCurrentStep(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>,
        portalTarget
      )}

      <div className="form-container">
        <div className="step-title">{steps[currentStep]}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-scroll">

            {/* SEHEMU 1: TAARIFA ZA MWOMBAJI */}
            {currentStep === 0 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 1: TAARIFA ZA MWOMBAJI</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mwombaji</strong><br /><input type="text" name="jinaKamiliLaMwombaji" value={form.jinaKamiliLaMwombaji} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>Jinsia</strong><br /><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option value="Me">Me</option><option value="Ke">Ke</option></select></td>
                      <td colSpan={3}><strong>Jina maarufu</strong><br /><input type="text" name="jinaMaarufu" value={form.jinaMaarufu} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Tarehe ya kuzaliwa</strong><br /><input type="date" name="tareheYaKuzaliwa" value={form.tareheYaKuzaliwa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya kitambulisho</strong><br /><select name="ainaYaKitambulisho" value={form.ainaYaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option value="Kitambulisho cha Taifa">Kitambulisho cha Taifa</option><option value="Pasipoti">Pasipoti</option><option value="Leseni ya kuendesha">Leseni ya kuendesha</option></select></td>
                      <td colSpan={4}><strong>Namba ya kitambulisho</strong><br /><input type="text" name="nambaYaKitambulisho" value={form.nambaYaKitambulisho} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Namba ya simu</strong><br /><input type="tel" name="nambaYaSimu" value={form.nambaYaSimu} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Barua pepe (Email)</strong><br /><input type="email" name="baruaPepe" value={form.baruaPepe} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Uraia (Nationality)</strong><br /><input type="text" name="uraia" value={form.uraia} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Hali ya ndoa</strong><br /><select name="haliYaNdoa" value={form.haliYaNdoa} onChange={handleChange}><option value="">Chagua</option><option value="Nimeoa/Olewa">1. Nimeoa/Olewa</option><option value="Sijaoa/Olewa">2. Sijaoa/Olewa</option><option value="Nimeachika">3. Nimeachika</option><option value="Mjane">4. Mjane</option></select></td>
                    </tr>
                    <tr><td colSpan={12} className="sub-header" style={{ background: "#f0f0f0", fontWeight: "bold" }}>MAHALI UNAPOISHI KWA SASA</td></tr>
                    <tr>
                      <td colSpan={3}><strong>Mkoa</strong><br /><input type="text" name="mahaliUnapoishiMkoa" value={form.mahaliUnapoishiMkoa} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Wilaya</strong><br /><input type="text" name="mahaliUnapoishiWilaya" value={form.mahaliUnapoishiWilaya} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Kata</strong><br /><input type="text" name="mahaliUnapoishiKata" value={form.mahaliUnapoishiKata} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Mtaa</strong><br /><input type="text" name="mahaliUnapoishiMtaa" value={form.mahaliUnapoishiMtaa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Umiliki wa makazi</strong><br />
                        <select name="umilikiWaMakazi" value={form.umilikiWaMakazi} onChange={handleChange}>
                          <option value="">Chagua</option><option value="Kwake">Kwake</option><option value="Mengine">Mengine (eleza)</option>
                        </select>
                        {form.umilikiWaMakazi === "Mengine" && <input type="text" name="umilikiWaMakaziMengine" value={form.umilikiWaMakaziMengine} onChange={handleChange} style={{ marginTop: "5px" }} placeholder="Eleza hapa..." />}
                      </td>
                      <td colSpan={3}><strong>Namba ya nyumba</strong><br /><input type="text" name="nambaYaNyumba" value={form.nambaYaNyumba} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>Umepanga</strong><br /><select name="umepanga" value={form.umepanga} onChange={handleChange}><option value="">Chagua</option><option value="Ndio">Ndio</option><option value="Hapana">Hapana</option></select></td>
                      <td colSpan={3}><strong>Umeishi hapo tangu (miezi)</strong><br /><input type="text" name="umeishiHapoTanguMiezi" value={form.umeishiHapoTanguMiezi} onChange={handleChange} /></td>
                    </tr>
                    <tr><td colSpan={12} className="sub-header" style={{ background: "#f0f0f0", fontWeight: "bold" }}>TAARIFA ZA MUME/MKE</td></tr>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mume/mke</strong><br /><input type="text" name="jinaKamiliLaMumeMke" value={form.jinaKamiliLaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Simu</strong><br /><input type="tel" name="simuYaMumeMke" value={form.simuYaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Jina maarufu mtaani</strong><br /><input type="text" name="jinaMaarufuMtaani" value={form.jinaMaarufuMtaani} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya kitambulisho</strong><br /><select name="ainaYaKitambulishoMumeMke" value={form.ainaYaKitambulishoMumeMke} onChange={handleChange}><option value="">Chagua</option><option value="Kitambulisho cha Taifa">Kitambulisho cha Taifa</option><option value="Pasipoti">Pasipoti</option></select></td>
                      <td colSpan={4}><strong>Namba ya kitambulisho</strong><br /><input type="text" name="nambaYaKitambulishoMumeMke" value={form.nambaYaKitambulishoMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Kazi anayofanya</strong><br /><input type="text" name="kaziYaMumeMke" value={form.kaziYaMumeMke} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Jina la mwajiri</strong><br /><input type="text" name="jinaLaMwajiriWaMumeMke" value={form.jinaLaMwajiriWaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Simu ya ofisi</strong><br /><input type="tel" name="simuYaOfisiYaMumeMke" value={form.simuYaOfisiYaMumeMke} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 2: TAARIFA ZA AJIRA */}
            {currentStep === 1 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 2: TAARIFA ZA AJIRA</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={6}><strong>Jina la kampuni/mwajiri</strong><br /><input type="text" name="jinaLaKampuniYaMwajiri" value={form.jinaLaKampuniYaMwajiri} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Anuani ya ofisi ya mwajiri</strong><br /><input type="text" name="anuaniYaOfisiYaMwajiri" value={form.anuaniYaOfisiYaMwajiri} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Wadhifa wako</strong><br /><input type="text" name="wadhifa" value={form.wadhifa} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Umefanya kazi hapo toka lini</strong><br /><input type="text" name="tareheYaKuanzaKazi" value={form.tareheYaKuanzaKazi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Mshahara kwa mwezi (Tsh)</strong><br /><input type="number" name="mshaharaKwaMwezi" value={form.mshaharaKwaMwezi} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Aina ya ajira</strong><br /><select name="ainaYaAjira" value={form.ainaYaAjira} onChange={handleChange}><option value="">Chagua</option><option value="Kudumu">Kudumu</option><option value="Mkataba">Mkataba</option><option value="Ya muda mfupi">Ya muda mfupi</option></select></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Tarehe ya kumaliza mkataba</strong><br /><input type="date" name="tareheYaKumalizaMkataba" value={form.tareheYaKumalizaMkataba} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Tarehe ya kustaafu</strong><br /><input type="date" name="tareheYaKustaafu" value={form.tareheYaKustaafu} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}


            {/* SEHEMU 3: TAARIFA ZA BIASHARA */}
            {currentStep === 2 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 3: TAARIFA ZA BIASHARA</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Jina la Biashara</strong></td><td colSpan={6}><strong>Aina ya Biashara</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="jinaLaBiashara" value={form.jinaLaBiashara} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="ainaYaBiashara" value={form.ainaYaBiashara} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Mahali Biashara Ilipo</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="mahaliBiasharaIlipo" value={form.mahaliBiasharaIlipo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Umefanya Biashara hii tangu lini</strong></td><td colSpan={6}><strong>Jina la mmiliki wa eneo la biashara</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="umefanyaBiasharaTanguLini" value={form.umefanyaBiasharaTanguLini} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="jinaMmilikiEneoBiashara" value={form.jinaMmilikiEneoBiashara} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Namba zake za simu</strong></td><td colSpan={6}><strong>Wastani wa kipato kwa mwezi</strong></td></tr>
                    <tr><td colSpan={6}><input type="tel" name="nambaSimuMmilikiEneo" value={form.nambaSimuMmilikiEneo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="wastaniKipatoKwaMwezi" value={form.wastaniKipatoKwaMwezi} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Muda wa mkataba wa eneo la biashara</strong></td><td colSpan={6}><strong>Wastani wa matumizi kwa mwezi</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mudaMkatabaEneoBiashara" value={form.mudaMkatabaEneoBiashara} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="wastaniMatumiziKwaMwezi" value={form.wastaniMatumiziKwaMwezi} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 4: KIASI CHA MKOPO */}
            {currentStep === 3 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 4: KIASI CHA MKOPO</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Kiasi cha Mkopo</strong></td><td colSpan={6}><strong>Kwa maneno</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="kiasiMkopo" value={form.kiasiMkopo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="kwaManeno" value={form.kwaManeno} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Muda wa kulipa Mkopo</strong></td><td colSpan={6}><strong>Kwa tarakimu</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mudaKulipaMkopo" value={form.mudaKulipaMkopo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="kwaTarakimu" value={form.kwaTarakimu} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="kiasiRejeshoBilaMatatizo" value={form.kiasiRejeshoBilaMatatizo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Malengo ya Mkopo</strong></td></tr>
                    <tr><td colSpan={12}><textarea name="malengoMkopo" rows={3} value={form.malengoMkopo} onChange={handleChange}></textarea></td></tr>
                    <tr><td colSpan={12}><strong>Chanzo cha Mapato</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="chanzoMapato" value={form.chanzoMapato} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 5: HISTORIA YA MIKOPO */}
            {currentStep === 4 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 5: HISTORIA YA MIKOPO</div>
                <table className="form-table history-table">
                  <thead>
                    <tr><th>Jina la Taasisi</th><th>Ulichukua Mkopo lini</th><th>Kiasi cha mkopo</th><th>Kiasi cha marejesho</th><th>Tarehe za marejesho</th><th>Kiasi kilichobaki</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><input type="text" name="historia1JinaTaasisi" value={form.historia1JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia1UlichukuaLini" value={form.historia1UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiMkopo" value={form.historia1KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiMarejesho" value={form.historia1KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia1TareheMarejesho" value={form.historia1TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiKilichobaki" value={form.historia1KiasiKilichobaki} onChange={handleChange} /></td></tr>
                    <tr><td><input type="text" name="historia2JinaTaasisi" value={form.historia2JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia2UlichukuaLini" value={form.historia2UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiMkopo" value={form.historia2KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiMarejesho" value={form.historia2KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia2TareheMarejesho" value={form.historia2TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiKilichobaki" value={form.historia2KiasiKilichobaki} onChange={handleChange} /></td></tr>
                    <tr><td><input type="text" name="historia3JinaTaasisi" value={form.historia3JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia3UlichukuaLini" value={form.historia3UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiMkopo" value={form.historia3KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiMarejesho" value={form.historia3KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia3TareheMarejesho" value={form.historia3TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiKilichobaki" value={form.historia3KiasiKilichobaki} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 6: DHAMANA YA MKOPO */}
            {currentStep === 5 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 6: DHAMANA YA MKOPO</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Aina ya dhamana</strong></td><td colSpan={6}><strong>Namba za usajili</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="dhamanaAina" value={form.dhamanaAina} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="dhamanaNambaUsajili" value={form.dhamanaNambaUsajili} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Umiliki</strong></td><td colSpan={6}><strong>Thamani yake kwa sasa</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="dhamanaUmiliki" value={form.dhamanaUmiliki} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="dhamanaThamaniKwaSasa" value={form.dhamanaThamaniKwaSasa} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Muonekano wa dhamana</strong></td></tr>
                    <tr><td colSpan={12}><select name="dhamanaMuonekano" value={form.dhamanaMuonekano} onChange={handleChange}><option value="">Chagua</option><option>Nzuri sana</option><option>Nzuri</option><option>Kuridhisha</option><option>Inahitaji matengenezo</option></select></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 7: WADHAMINI NO.1 */}
            {currentStep === 6 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 7: TAARIFA ZA WADHAMINI NO.1</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={4}><strong>Jina kamili la Mdhamini</strong></td><td colSpan={4}><strong>Mahali Anapoishi</strong></td><td colSpan={4}><strong>Amepanga/ kwake</strong></td></tr>
                    <tr><td colSpan={4}><input type="text" name="wdhamini1JinaKamili" value={form.wdhamini1JinaKamili} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini1MahaliAnapoishi" value={form.wdhamini1MahaliAnapoishi} onChange={handleChange} /></td><td colSpan={4}><select name="wdhamini1AmepangaKwake" value={form.wdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></td></tr>
                    <tr><td colSpan={4}><strong>Namba ya nyumba</strong></td><td colSpan={4}><strong>Kazi Anayofanya</strong></td><td colSpan={4}><strong>Uhusiano wenu</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini1NambaNyumba" value={form.wdhamini1NambaNyumba} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini1KaziAnayofanya" value={form.wdhamini1KaziAnayofanya} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini1UhusianoWenu" value={form.wdhamini1UhusianoWenu} onChange={handleChange} /></td>
                    </tr>
                    <tr><td colSpan={4}><strong>Mahali ilipo Ofisi yake</strong></td><td colSpan={4}><strong>Jina la kampuni/ biashara</strong></td><td colSpan={4}><strong>Simu</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini1MahaliOfisiYake" value={form.wdhamini1MahaliOfisiYake} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini1JinaKampuniBiashara" value={form.wdhamini1JinaKampuniBiashara} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="tel" name="wdhamini1Simu" value={form.wdhamini1Simu} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 7: WADHAMINI NO.2 */}
            {currentStep === 7 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 7: TAARIFA ZA WADHAMINI NO.2</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={4}><strong>Jina kamili la Mdhamini</strong></td><td colSpan={4}><strong>Mahali Anapoishi</strong></td><td colSpan={4}><strong>Amepanga/ kwake</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini2JinaKamili" value={form.wdhamini2JinaKamili} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini2MahaliAnapoishi" value={form.wdhamini2MahaliAnapoishi} onChange={handleChange} /></td>
                      <td colSpan={4}><select name="wdhamini2AmepangaKwake" value={form.wdhamini2AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></td>
                    </tr>
                    <tr><td colSpan={4}><strong>Namba ya nyumba</strong></td><td colSpan={4}><strong>Kazi Anayofanya</strong></td><td colSpan={4}><strong>Uhusiano wenu</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini2NambaNyumba" value={form.wdhamini2NambaNyumba} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini2KaziAnayofanya" value={form.wdhamini2KaziAnayofanya} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini2UhusianoWenu" value={form.wdhamini2UhusianoWenu} onChange={handleChange} /></td>
                    </tr>
                    <tr><td colSpan={4}><strong>Mahali ilipo Ofisi yake</strong></td><td colSpan={4}><strong>Jina la kampuni/ biashara</strong></td><td colSpan={4}><strong>Simu</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini2MahaliOfisiYake" value={form.wdhamini2MahaliOfisiYake} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini2JinaKampuniBiashara" value={form.wdhamini2JinaKampuniBiashara} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="tel" name="wdhamini2Simu" value={form.wdhamini2Simu} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* PICHA YA PASSPORT */}
            {currentStep === 8 && (
              <div className="tamko-container">
                <div className="tamko-card">
                  <p><strong>Mimi</strong> nimeomba mkopo wa <strong>Tsh {form.kiasiMkopo || "____"}</strong> kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu. Pia kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine.</p>
                  <label><input type="checkbox" name="tamkoLaMwombaji" checked={form.tamkoLaMwombaji} onChange={handleChange} /> Ninakubali tamko la mwombaji</label>
                </div>
              </div>
            )}

            {/* TAMKO NA WASILISHA */}
            {currentStep === 9 && (
              <div className="form-section">
                <div className="section-divider">TAMKO NA WASILISHA</div>
                <div className="tamko-content">
                  <div className="tamko-card">
                    <p><strong>TAMKO LA MWOMBAJI</strong></p>
                    <p>Mimi nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu.</p>
                    <p>Pia Kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine kama ilivyoanishwa kwenye sheria na miongozo inayotolewa na Benki Kuu Ya Tanzania pamoja na Tume ya Ulinzi wa Taarifa Binafsi.</p>
                    <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                    <label><input type="checkbox" name="tamkoLaMwombaji" checked={form.tamkoLaMwombaji} onChange={handleChange} /> Ninakubali Tamko la Mwombaji</label>
                  </div>
                  <div className="tamko-card">
                    <p><strong>TAMKO LA MDHAMINI 1</strong></p>
                    <p>Mimi nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa kwa wakati sawa sawa na mkataba wa mkopo huu.</p>
                    <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                    <label><input type="checkbox" name="tamkoMdhamini1" checked={form.tamkoMdhamini1} onChange={handleChange} /> Ninakubali Tamko la Mdhamini 1</label>
                  </div>
                  <div className="tamko-card">
                    <p><strong>TAMKO LA MDHAMINI 2</strong></p>
                    <p>Mimi nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa kwa wakati sawa sawa na mkataba wa mkopo huu.</p>
                    <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                    <label><input type="checkbox" name="tamkoMdhamini2" checked={form.tamkoMdhamini2} onChange={handleChange} /> Ninakubali Tamko la Mdhamini 2</label>
                  </div>
                  <div className="contact-info">
                    <p>NB: KWA CHANGAMOTO AMA MALALAMIKO USISITE KUTUPIGIA KUPITIA Tel No: +255 769337774 or +255 702 519 104.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-buttons">
            {currentStep > 0 && (
              <button type="button" className="btn-prev" onClick={prevStep}>◄ NYUMA</button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn-next" onClick={nextStep}>ENDELEA ►</button>
            ) : (
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "INAWASILISHA..." : "WASILISHA OMBI"}
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .page-container {
          background: #e8f0fe;
          padding: 16px;
          font-family: 'Times New Roman', 'Arial', sans-serif;
        }
        .form-container {
          max-width: 1300px;
          width: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .form-portal-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .fomu-no {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        .fomu-no-input {
          width: 130px;
          padding: 6px 10px;
          margin-left: 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          color: #0f172a;
          font-weight: normal;
          outline: none;
        }
        .fomu-no-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        .step-indicators {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .step-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-btn.completed { background: #22c55e; color: white; border-color: #22c55e; }
        .step-btn.active { background: #1a3a5c; color: white; border-color: #1a3a5c; box-shadow: 0 0 0 3px rgba(26, 58, 92, 0.2); }
        .step-title {
          background: #e0e0e0;
          padding: 8px 20px;
          font-weight: bold;
          font-size: 14px;
          border-bottom: 2px solid #1a3a5c;
        }
        .form-scroll {
          padding: 20px;
          max-height: calc(100vh - 300px);
          overflow-y: auto;
        }
        .section-divider {
          background: #1a3a5c;
          color: white;
          padding: 8px 15px;
          margin-bottom: 15px;
          margin-top: 5px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }
        .form-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        .form-table td, .form-table th {
          border: 1px solid #ddd;
          padding: 6px;
          vertical-align: top;
          font-size: 13px;
        }
        .form-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
        .form-table input, .form-table select, .form-table textarea {
          width: 100%;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 2px;
          font-family: inherit;
          font-size: 12px;
        }
        .history-table th, .history-table td { padding: 4px; }
        .history-table input { min-width: 80px; }
        .passport-upload {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
        }
        .passport-preview {
          width: 150px;
          height: 170px;
          border: 2px solid #ccc;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .passport-preview img { width: 100%; height: 100%; object-fit: cover; }
        .preview-placeholder { text-align: center; color: #999; font-size: 11px; }
        .upload-controls { flex: 1; min-width: 220px; }
        .upload-btn {
          display: inline-block;
          background: #1a3a5c;
          color: white;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 2px;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .upload-note {
          margin-top: 10px;
          padding: 8px;
          background: #f5f5f5;
          font-size: 11px;
        }
        .tamko-content { display: flex; flex-direction: column; gap: 20px; }
        .tamko-card {
          background: #f8fafc;
          padding: 15px;
          border-radius: 12px;
          border-left: 4px solid #1a3a5c;
        }
        .tamko-card p { margin-bottom: 10px; line-height: 1.5; text-align: justify; font-size: 12px; }
        .tamko-line { margin: 10px 0; padding: 5px; border-bottom: 1px dotted #999; }
        .tamko-card label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
        }
        .contact-info {
          margin-top: 15px;
          padding: 10px;
          background: #fef3c7;
          border-radius: 8px;
          text-align: center;
          font-size: 11px;
          color: #92400e;
        }
        .nav-buttons {
          display: flex;
          gap: 15px;
          padding: 15px 20px;
          background: #ffffff;
          border-top: 2px solid #1a3a5c;
        }
        .btn-prev {
          flex: 1;
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          border-radius: 8px;
          background: #6c757d;
          color: white;
        }
        .btn-next {
          flex: 1;
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          border-radius: 8px;
          background: #28a745;
          color: white;
        }
        .btn-submit {
          flex: 1;
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          border-radius: 8px;
          background: #007bff;
          color: white;
        }
        .btn-prev:hover, .btn-next:hover, .btn-submit:hover { opacity: 0.85; transform: translateY(-2px); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @media (max-width: 800px) {
          .page-container { padding: 10px; }
          .form-scroll { padding: 12px; max-height: 50vh; }
          .form-table td, .form-table th { padding: 3px; font-size: 11px; }
          .history-table { display: block; overflow-x: auto; }
          .btn-prev, .btn-next, .btn-submit { padding: 8px 12px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
}

export default PersonalLoan;