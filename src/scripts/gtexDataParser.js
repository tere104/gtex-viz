function getTissueJson(){
    "use strict";
    return data/tissues.json
}

function getMedianTPMJson(){
    return "data/genes.median.tpm.json";
}

function getTissueClusters(){
    const newick = "((((((((((Testis:0.68,Brain_Cerebellum:0.68):0.30,Prostate:0.98):0.17,(Brain_Nucleus_accumbens_basal_ganglia:0.78,Brain_Hypothalamus:0.78):0.36):0.31,Cervix_Ectocervix:1.45):0.35,Esophagus_Gastroesophageal_Junction:1.80):0.38,Pituitary:2.19):0.65,(((Brain_Putamen_basal_ganglia:0.83,Brain_Cortex:0.83):0.50,Skin_Not_Sun_Exposed_Suprapubic:1.32):0.51,Brain_Hippocampus:1.84):1.00):1.13,((((((Brain_Frontal_Cortex_BA9:0.47,Brain_Anterior_cingulate_cortex_BA24:0.47):0.20,Bladder:0.67):0.15,((Breast_Mammary_Tissue:0.47,Brain_Cerebellar_Hemisphere:0.47):0.15,Brain_Caudate_basal_ganglia:0.62):0.21):0.31,Esophagus_Mucosa:1.13):0.24,(Spleen:0.75,Colon_Sigmoid:0.75):0.63):0.48,(((Cells_Transformed_fibroblasts:0.26,Cells_EBV-transformed_lymphocytes:0.26):0.30,(Cervix_Endocervix:0.24,Brain_Spinal_cord_cervical_c-1:0.24):0.32):0.05,(((Brain_Substantia_nigra:0.15,Brain_Amygdala:0.15):0.09,Skin_Sun_Exposed_Lower_leg:0.25):0.24,Small_Intestine_Terminal_Ileum:0.48):0.13):1.24):2.11):2.90,(((Whole_Blood:1.14,Stomach:1.14):0.75,((((Uterus:0.66,Heart_Left_Ventricle:0.66):0.05,Kidney_Cortex:0.71):0.32,((Liver:0.38,Heart_Atrial_Appendage:0.38):0.19,Fallopian_Tube:0.57):0.45):0.06,Vagina:1.08):0.82):0.62,((Esophagus_Muscularis:1.25,Colon_Transverse:1.25):0.37,Thyroid:1.62):0.90):4.36):8.82,((((Artery_Coronary:1.04,Artery_Aorta:1.04):1.79,Adrenal_Gland:2.82):0.19,(Artery_Tibial:1.75,Adipose_Subcutaneous:1.75):1.27):1.19,(((((Pancreas:0.41,Adipose_Visceral_Omentum:0.41):0.22,Muscle_Skeletal:0.64):0.10,(Nerve_Tibial:0.51,Minor_Salivary_Gland:0.51):0.22):0.15,Ovary:0.88):0.91,Lung:1.79):2.41):11.48);";
    return newick;
}

function getGeneClusters(){
    const newick = "(((((SLC25A21:1.47,GAS6-AS1:1.47):1.53,SLC27A6:2.99):0.84,TMEM229A:3.83):2.34,((TMEM255B:2.47,TMEM106B:2.47):0.62,GAS6-AS2:3.08):3.09):7.25,(TMEM167B:4.53,GAS6:4.53):8.89);";
    return newick;
}

function getGtexURLs(){
    return {
        "geneExp": "https://gtexportal.org/rest/v1/dataset/featureExpression?feature=gene&gencode_id=",
        "tissue": "https://gtexportal.org/rest/v1/dataset/color"
    }
}

function parseMedianTPM(data, useLog=true){
    // parse GTEx median TPM json
    data.forEach(function(d){

        d.value = useLog?(d.medianTPM==0?0:Math.log2(+d.medianTPM + 0.001)):+d.medianTPM;
        d.x = d.tissueId;
        d.y = d.geneSymbol;
        d.originalValue = d.medianTPM;
        d.id = d.gencodeId;
    });
    return data;
}

function parseTissue(data){
    return data.color
}

function parseGeneExpression(data, useLog=false, color="grey", xlist = []){
    let gene = data["featureExpression"][0];
    let x = [];
    let y = [];
    let xorder = xlist.length == 0? d3.keys(gene.genetpm):xlist;
    xorder.forEach((d)=>{
        // preparing for the plotly data structure of a grouped boxplot
        // reference: https://plot.ly/javascript/box-plots/
        // concatenates all the values of a tissue to the list values
        // concatenates a list of the tissue label repeatedly
        x = x.concat(Array(gene.genetpm[d].length).fill(d));
        y = y.concat(gene.genetpm[d])
    });
    return {
        x: x,
        y: y,
        name: gene.name,
        type: 'box',
        line: {width:1},
        marker: {color:color},
    };

}