import { useState } from "react";
import axios from "axios";

function GroupLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fomuNo: "",
    jinaKamiliLaMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    ainaYaKitambulisho: "",
    nambaYaKitambulisho: "",
    tareheYaKuzaliwa: "",
    simu: "",
    haliYaNdoa: "",
    eneoUnaioishi: "",
    umeishiHapoTanguLini: "",
    umilikiWaMakazi: "",
    jinaKamiliLaMumeMke: "",
    maarufuMtaani: "",
    tareheYaKuzaliwaMumeMke: "",
    idadiYaUtegemezi: "",
    simuYaMumeMke: "",
    jinaLaMwenyekiti: "",
    jinaLaKatibu: "",
    anuaniYaMakaziYaKikundi: "",
    nambaYaUsajiliWaKikundi: "",
    mkoa: "",
    wilaya: "",
    kata: "",
    kijijiMtaa: "",
    idadiYaWanachamaMe: "",
    idadiYaWanachamaKe: "",
    mudaKikundiKimekaaKatikaAnuaniHii: "",
    tareheYaUsajiri: "",
    simu1: "",
    simu2: "",
    jinaLaMradi: "",
    ainaYaMradi: "",
    mahaliMradiUpoKata: "",
    mahaliMradiUpoWilaya: "",
    wastaniWaKipatoKwaMwezi: "",
    wastaniWaMatumiziKwaMwezi: "",
    mradiUmeanzaLini: "",
    kiasiChaMkopo: "",
    mudaWaLipaMkopo: "",
    kiasiGaniChaRejesho: "",
    malengoYaMkopo: "",
    kiasiKikundiKinadaiwa: "",
    kikundiKimewahiKukopa: "",
    chanzoChaMapato: "",
    mdhamini1JinaKamili: "",
    mdhamini1MahaliAnapoishi: "",
    mdhamini1NambaYaNyumba: "",
    mdhamini1AmepangaKwake: "",
    mdhamini1KaziAnayofanya: "",
    mdhamini1MahaliIlipoOfisi: "",
    mdhamini1JinaLaKampuni: "",
    mdhamini1Simu: "",
    dhamanaAinaYaDhamana: "",
    dhamanaNambaYaUsajili: "",
    dhamanaThamaniYaDhamana: "",
    dhamanaThamaniYakeKwaSasa: "",
    dhamanaUmri: "",
    dhamanaMmilikiWamiliki: "",
    dhamanaRangiMuonekano: "",
    dhamanaMahaliIlipo: "",
    tamkoMwombaji: false,
    tamkoMdhaminiUhusiano: "",
    tamkoMdhamini: false,
    tamkoWajibika: false,
  });

  const steps = [
    "SEHEMU 1: TAARIFA ZA MWOMBAJI",
    "SEHEMU 2: TAARIFA ZA KIKUNDI",
    "SEHEMU 3: TAARIFA ZA MIRADI",
    "SEHEMU 4: KIASI CHA MKOPO",
    "SEHEMU 5: MDHAMINI (MWENYEKITI)",
    "SEHEMU 6: TAARIFA ZA DHAMANA",
    "TAMKO NA WASILISHA"
  ];

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

    if (!form.tamkoMwombaji || !form.tamkoMdhamini || !form.tamkoWajibika) {
      alert("Tafadhali kubali tamko zote za mwombaji na mdhamini");
      return;
    }

    if (!form.jinaKamiliLaMwombaji || !form.kiasiChaMkopo) {
      alert("Tafadhali jaza jina la mwombaji na kiasi cha mkopo");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const res = await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliLaMwombaji,
        phone: form.simu,
        amount: form.kiasiChaMkopo,
        type: "group",
        details: form,
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      console.log(res.data);
      alert("✅ OMBI LA MKOPO WA KIKUNDI LIMEWASILISHWA KWA MAFANIKIO!");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Imeshindwa kuwasilisha ombi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="form-header">
          <div className="fomu-no">Fomu No: <input type="text" name="fomuNo" value={form.fomuNo} onChange={handleChange} placeholder="........" className="fomu-no-input" /></div>
          <h1>FOMU YA MAOMBI YA MKOPO WA KIKUNDI</h1>
        </div>

        <div className="step-indicators">
          {steps.map((_, idx) => (
            <button key={idx} className={`step-btn ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`} onClick={() => idx < currentStep && setCurrentStep(idx)}>
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="step-title">{steps[currentStep]}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-scroll">
            
            {/* SEHEMU 1: TAARIFA ZA MWOMBAJI */}
            {currentStep === 0 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mwombaji</strong></td>
                      <td colSpan={2}><strong>Jinsia</strong></td>
                      <td colSpan={4}><strong>Jina maarufu</strong></td>
                      <td colSpan={2}><strong>Aina ya Kitambulisho</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="jinaKamiliLaMwombaji" value={form.jinaKamiliLaMwombaji} onChange={handleChange} /></td>
                      <td colSpan={2}><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option>Me</option><option>Ke</option></select></td>
                      <td colSpan={4}><input type="text" name="jinaMaarufu" value={form.jinaMaarufu} onChange={handleChange} /></td>
                      <td colSpan={2}><select name="ainaYaKitambulisho" value={form.ainaYaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option><option>Leseni</option></select></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Namba ya Kitambulisho</strong></td>
                      <td colSpan={2}><strong>Tarehe ya kuzaliwa</strong></td>
                      <td colSpan={4}><strong>Simu</strong></td>
                      <td colSpan={2}><strong>Hali ya Ndoa</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="nambaYaKitambulisho" value={form.nambaYaKitambulisho} onChange={handleChange} /></td>
                      <td colSpan={2}><input type="date" name="tareheYaKuzaliwa" value={form.tareheYaKuzaliwa} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="tel" name="simu" value={form.simu} onChange={handleChange} /></td>
                      <td colSpan={2}><select name="haliYaNdoa" value={form.haliYaNdoa} onChange={handleChange}><option value="">Chagua</option><option>Hajaoa/Olewa</option><option>Ameoa/Olewa</option><option>Ameachika</option><option>Mjane/Mgane</option></select></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Eneo unaioishi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="text" name="eneoUnaioishi" value={form.eneoUnaioishi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Umeishi hapo tangu lini</strong></td>
                      <td colSpan={6}><strong>Umiliki wa Makazi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="umeishiHapoTanguLini" value={form.umeishiHapoTanguLini} onChange={handleChange} /></td>
                      <td colSpan={6}><select name="umilikiWaMakazi" value={form.umilikiWaMakazi} onChange={handleChange}><option value="">Chagua</option><option>Kwako</option><option>Umepanga</option><option>Mengine (Eleza)</option></select></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Jina kamili la mume/mke</strong></td>
                      <td colSpan={6}><strong>Maarufu mtaani</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="jinaKamiliLaMumeMke" value={form.jinaKamiliLaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="maarufuMtaani" value={form.maarufuMtaani} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Tarehe ya kuzaliwa (mume/mke)</strong></td>
                      <td colSpan={6}><strong>Idadi ya utegemezi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="date" name="tareheYaKuzaliwaMumeMke" value={form.tareheYaKuzaliwaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="number" name="idadiYaUtegemezi" value={form.idadiYaUtegemezi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Simu ya mume/mke</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="tel" name="simuYaMumeMke" value={form.simuYaMumeMke} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 2: TAARIFA ZA KIKUNDI */}
            {currentStep === 1 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={6}><strong>Jina la Mwenyekiti</strong></td>
                      <td colSpan={6}><strong>Jina la Katibu</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="jinaLaMwenyekiti" value={form.jinaLaMwenyekiti} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="jinaLaKatibu" value={form.jinaLaKatibu} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Anuani ya Makazi ya kikundi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="text" name="anuaniYaMakaziYaKikundi" value={form.anuaniYaMakaziYaKikundi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Namba ya usajili wa kikundi</strong></td>
                      <td colSpan={6}><strong>Mkoa</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="nambaYaUsajiliWaKikundi" value={form.nambaYaUsajiliWaKikundi} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="mkoa" value={form.mkoa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={3}><strong>Wilaya</strong></td>
                      <td colSpan={3}><strong>Kata</strong></td>
                      <td colSpan={3}><strong>Kijiji/mtaa</strong></td>
                      <td colSpan={3}><strong>Idadi ya wanachama (ME)</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={3}><input type="text" name="wilaya" value={form.wilaya} onChange={handleChange} /></td>
                      <td colSpan={3}><input type="text" name="kata" value={form.kata} onChange={handleChange} /></td>
                      <td colSpan={3}><input type="text" name="kijijiMtaa" value={form.kijijiMtaa} onChange={handleChange} /></td>
                      <td colSpan={3}><input type="number" name="idadiYaWanachamaMe" value={form.idadiYaWanachamaMe} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Idadi ya wanachama (KE)</strong></td>
                      <td colSpan={6}><strong>Muda kikundi kimekaa katika Anuani hii</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="number" name="idadiYaWanachamaKe" value={form.idadiYaWanachamaKe} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="mudaKikundiKimekaaKatikaAnuaniHii" value={form.mudaKikundiKimekaaKatikaAnuaniHii} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Tarehe ya usajiri</strong></td>
                      <td colSpan={6}><strong>Simu 1</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="date" name="tareheYaUsajiri" value={form.tareheYaUsajiri} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="tel" name="simu1" value={form.simu1} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Simu 2</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="tel" name="simu2" value={form.simu2} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 3: TAARIFA ZA MIRADI */}
            {currentStep === 2 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={6}><strong>Jina la Mradi</strong></td>
                      <td colSpan={6}><strong>Aina ya Mradi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="jinaLaMradi" value={form.jinaLaMradi} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="ainaYaMradi" value={form.ainaYaMradi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Mahali mradi upo (Kata)</strong></td>
                      <td colSpan={6}><strong>Mahali mradi upo (Wilaya)</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="mahaliMradiUpoKata" value={form.mahaliMradiUpoKata} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="mahaliMradiUpoWilaya" value={form.mahaliMradiUpoWilaya} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Wastani wa kipato kwa mwezi (TZS)</strong></td>
                      <td colSpan={6}><strong>Wastani wa matumizi kwa mwezi (TZS)</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="wastaniWaKipatoKwaMwezi" value={form.wastaniWaKipatoKwaMwezi} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="wastaniWaMatumiziKwaMwezi" value={form.wastaniWaMatumiziKwaMwezi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Mradi umeanza lini</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="text" name="mradiUmeanzaLini" value={form.mradiUmeanzaLini} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 4: KIASI CHA MKOPO */}
            {currentStep === 3 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={6}><strong>Kiasi cha Mkopo (TZS)</strong></td>
                      <td colSpan={6}><strong>Muda wa kulipa Mkopo</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="kiasiChaMkopo" value={form.kiasiChaMkopo} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="mudaWaLipaMkopo" value={form.mudaWaLipaMkopo} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="text" name="kiasiGaniChaRejesho" value={form.kiasiGaniChaRejesho} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Malengo ya Mkopo</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><textarea name="malengoYaMkopo" rows={2} value={form.malengoYaMkopo} onChange={handleChange}></textarea></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Kiasi kikundi kinadaiwa</strong></td>
                      <td colSpan={6}><strong>Kikundi kimewahi kukopa?</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="kiasiKikundiKinadaiwa" value={form.kiasiKikundiKinadaiwa} onChange={handleChange} /></td>
                      <td colSpan={6}><select name="kikundiKimewahiKukopa" value={form.kikundiKimewahiKukopa} onChange={handleChange}><option value="">Chagua</option><option>NDIYO</option><option>HAPANA</option></select></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Chanzo cha mapato</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><input type="text" name="chanzoChaMapato" value={form.chanzoChaMapato} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 5: MDHAMINI (MWENYEKITI) */}
            {currentStep === 4 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={12}><strong>MDHAMINI NO. 1 (MWENYEKITI WA KIKUNDI)</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la Mwenyekiti</strong></td>
                      <td colSpan={4}><strong>Mahali Anapoishi</strong></td>
                      <td colSpan={4}><strong>Namba ya nyumba</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="mdhamini1JinaKamili" value={form.mdhamini1JinaKamili} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="mdhamini1MahaliAnapoishi" value={form.mdhamini1MahaliAnapoishi} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="mdhamini1NambaYaNyumba" value={form.mdhamini1NambaYaNyumba} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Amepanga kwake</strong></td>
                      <td colSpan={4}><strong>Kazi Anayofanya</strong></td>
                      <td colSpan={4}><strong>Mahali ilipo Ofisi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><select name="mdhamini1AmepangaKwake" value={form.mdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></td>
                      <td colSpan={4}><input type="text" name="mdhamini1KaziAnayofanya" value={form.mdhamini1KaziAnayofanya} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="mdhamini1MahaliIlipoOfisi" value={form.mdhamini1MahaliIlipoOfisi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Jina la kampuni/biashara</strong></td>
                      <td colSpan={4}><strong>Simu</strong></td>
                      <td colSpan={4}></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="mdhamini1JinaLaKampuni" value={form.mdhamini1JinaLaKampuni} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="tel" name="mdhamini1Simu" value={form.mdhamini1Simu} onChange={handleChange} /></td>
                      <td colSpan={4}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 6: TAARIFA ZA DHAMANA */}
            {currentStep === 5 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={12}><strong>TAARIFA ZA DHAMANA</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya Dhamana</strong></td>
                      <td colSpan={4}><strong>Namba ya usajili</strong></td>
                      <td colSpan={4}><strong>Thamani ya dhamana</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="dhamanaAinaYaDhamana" value={form.dhamanaAinaYaDhamana} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="dhamanaNambaYaUsajili" value={form.dhamanaNambaYaUsajili} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="dhamanaThamaniYaDhamana" value={form.dhamanaThamaniYaDhamana} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Thamani yake kwa sasa</strong></td>
                      <td colSpan={4}><strong>Umri</strong></td>
                      <td colSpan={4}><strong>Mmiliki/ wamiliki</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="dhamanaThamaniYakeKwaSasa" value={form.dhamanaThamaniYakeKwaSasa} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="dhamanaUmri" value={form.dhamanaUmri} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="dhamanaMmilikiWamiliki" value={form.dhamanaMmilikiWamiliki} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Rangi/Muonekano wa dhamana</strong></td>
                      <td colSpan={4}><strong>Mahali Ilipo</strong></td>
                      <td colSpan={4}></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="dhamanaRangiMuonekano" value={form.dhamanaRangiMuonekano} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="dhamanaMahaliIlipo" value={form.dhamanaMahaliIlipo} onChange={handleChange} /></td>
                      <td colSpan={4}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 7: TAMKO NA WASILISHA */}
            {currentStep === 6 && (
              <div className="form-section tamko-section">
                <div className="tamko-content">
                  <p><strong>TAMKO LA MWOMBAJI</strong><br/>Mimi nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu kwa matumizi ya ofisi. Pia Kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine.</p>
                  <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                  <label className="checkbox-label"><input type="checkbox" name="tamkoMwombaji" checked={form.tamkoMwombaji} onChange={handleChange} /> Ninakubali tamko la mwombaji</label>
                  
                  <p><strong>TAMKO LA MDHAMINI (MUME/MKE/NDUGU)</strong><br/>Mimi ninakiri kuwa na taarifa juu ya mkopo wa Tsh uliyoombwa na kutoka Orethan Microfinance. Dhamana tajwa hapo juu nazifahamu na nipo tayari zitolewe kama dhamana kwa mujibu wa masharti na taratibu zilizokubaliwa na mkopaji na mkopeshaji.</p>
                  <div className="tamko-line">SAHIHI _______________ DOLE GUMBA _______________ TAREHE _______________</div>
                  <div className="input-group"><input type="text" name="tamkoMdhaminiUhusiano" value={form.tamkoMdhaminiUhusiano} onChange={handleChange} placeholder=" " /><label>Uhusiano wako na mwombaji (Mume/Mke/Ndugu)</label></div>
                  <label className="checkbox-label"><input type="checkbox" name="tamkoMdhamini" checked={form.tamkoMdhamini} onChange={handleChange} /> Ninakubali tamko la mdhamini</label>
                  
                  <p><strong>TAMKO LA MDHAMINI WAJIBIKA</strong><br/>Mimi nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia, ninatambua na kukubali kwamba nitawajibika kulipa mkopo Pamoja na wajumbe wote wa kikundi endapo mkopaji atashindwa kulipa kama ilivyoainishwa kwenye mkataba.</p>
                  <div className="tamko-line">SAHIHI _______________ DOLE GUMBA _______________ TAREHE _______________</div>
                  <label className="checkbox-label"><input type="checkbox" name="tamkoWajibika" checked={form.tamkoWajibika} onChange={handleChange} /> Ninakubali kuwajibika kulipa pamoja na kikundi</label>
                  
                  <div className="contact-info">
                    <p>NB: KWA CHANGAMOTO AMA MALALAMIKO USISITE KUTUPIGIA KUPITIA Tel No.: (+255) 677 042 374 or (+255) 658 207 026</p>
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
        
        <div className="footer">
          <p>© 2026 Orethan Microfinance. Haki zote zimehifadhiwa.</p>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .page-container {
          min-height: 100vh;
          background: #e8f0fe;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Times New Roman', 'Arial', sans-serif;
        }
        
        .form-container {
          max-width: 1300px;
          width: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .form-header {
          background: #1a3a5c;
          padding: 12px 20px;
          text-align: center;
          color: white;
        }
        
        .fomu-no {
          text-align: right;
          margin-bottom: 8px;
          font-size: 13px;
        }
        
        .fomu-no-input {
          width: 120px;
          padding: 4px 8px;
          margin-left: 10px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }
        
        .form-header h1 {
          font-size: 18px;
          letter-spacing: 1px;
        }
        
        .step-indicators {
          display: flex;
          gap: 5px;
          padding: 10px 20px;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
          flex-wrap: wrap;
        }
        
        .step-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }
        
        .step-btn.active {
          background: #1a3a5c;
          color: white;
          border-color: #1a3a5c;
        }
        
        .step-btn.completed {
          background: #2e7d32;
          color: white;
          border-color: #2e7d32;
        }
        
        .step-title {
          background: #e0e0e0;
          padding: 8px 20px;
          font-weight: bold;
          font-size: 14px;
          border-bottom: 2px solid #1a3a5c;
        }
        
        .form-scroll {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .form-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .form-table td, .form-table th {
          border: 1px solid #ddd;
          padding: 6px;
          vertical-align: top;
          font-size: 13px;
        }
        
        .form-table th {
          background: #f0f0f0;
          font-weight: bold;
          text-align: center;
        }
        
        .form-table input, .form-table select, .form-table textarea {
          width: 100%;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 2px;
          font-family: inherit;
          font-size: 12px;
        }
        
        .form-table textarea {
          resize: vertical;
        }
        
        .tamko-section {
          padding: 20px;
        }
        
        .tamko-content p {
          margin-bottom: 12px;
          line-height: 1.5;
          text-align: justify;
          font-size: 12px;
        }
        
        .tamko-line {
          margin: 12px 0;
          padding: 4px;
          border-bottom: 1px dotted #999;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 10px 0;
          cursor: pointer;
          font-size: 13px;
        }
        
        .input-group {
          position: relative;
          margin: 10px 0;
        }
        
        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .input-group label {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          padding: 0 5px;
          color: #666;
          font-size: 12px;
          transition: 0.2s;
          pointer-events: none;
        }
        
        .input-group input:focus ~ label,
        .input-group input:not(:placeholder-shown) ~ label {
          top: -10px;
          font-size: 10px;
          color: #1a3a5c;
        }
        
        .contact-info {
          margin-top: 20px;
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
          padding: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          border-radius: 6px;
          background: #6c757d;
          color: white;
        }
        
        .btn-next {
          flex: 1;
          padding: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          border-radius: 6px;
          background: #28a745;
          color: white;
        }
        
        .btn-submit {
          flex: 1;
          padding: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          border-radius: 6px;
          background: #007bff;
          color: white;
        }
        
        .btn-prev:hover, .btn-next:hover, .btn-submit:hover {
          opacity: 0.85;
        }
        
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .footer {
          text-align: center;
          padding: 8px;
          background: #f5f5f5;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
        }
        
        @media (max-width: 800px) {
          .page-container { padding: 10px; }
          .form-scroll { padding: 12px; max-height: 50vh; }
          .form-table td, .form-table th { padding: 3px; font-size: 11px; }
          .btn-prev, .btn-next, .btn-submit { padding: 8px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}

export default GroupLoan;