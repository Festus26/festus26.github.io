/**
 * Model list component - shows all models in your folder
 */

document.addEventListener('DOMContentLoaded', function() {
    createModelListButton();
});

function createModelListButton() {
    // Create a button to show model list
    const button = document.createElement('button');
    button.id = 'show-model-list';
    button.innerText = 'Browse Models';
    button.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 15px;
        z-index: 20;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
    `;
    
    button.addEventListener('click', toggleModelList);
    
    // Add the button to the model viewer container
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        modelContainer.appendChild(button);
    }
}

function toggleModelList() {
    // Check if the model list already exists
    let modelList = document.getElementById('model-list-panel');
    
    if (modelList) {
        // Toggle visibility
        modelList.style.display = modelList.style.display === 'none' ? 'block' : 'none';
        return;
    }
    
    // Create the model list panel
    modelList = document.createElement('div');
    modelList.id = 'model-list-panel';
    modelList.style.cssText = `
        position: absolute;
        top: 50px;
        left: 10px;
        background: white;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        padding: 15px;
        z-index: 19;
        width: 250px;
        max-height: 300px;
        overflow-y: auto;
    `;
    
    // Add heading
    const heading = document.createElement('h3');
    heading.innerText = 'Available Models';
    heading.style.marginBottom = '10px';
    modelList.appendChild(heading);
    
    // Add all models from modelProjects
    if (window.modelProjects && window.modelProjects.length > 0) {
        const list = document.createElement('ul');
        list.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0;
        `;
        
        window.modelProjects.forEach((model, index) => {
            const item = document.createElement('li');
            item.style.cssText = `
                padding: 8px 10px;
                margin-bottom: 5px;
                background: #f5f5f5;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            item.innerText = model.title;
            
            // Add hover effect
            item.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#eaeaea';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            
            // Load the model when clicked
            item.addEventListener('click', function() {
                if (window.loadModel) {
                    window.loadModel(model.modelPath, model.title);
                    
                    // Show notification
                    if (window.showNotification) {
                        window.showNotification(`Loading model: ${model.title}`, 'info');
                    }
                }
            });
            
            list.appendChild(item);
        });
        
        modelList.appendChild(list);
    } else {
        const noModels = document.createElement('p');
        noModels.innerText = 'No models found. Add models to the modelProjects array.';
        modelList.appendChild(noModels);
    }
    
    // Add instruction to add local models
    const instruction = document.createElement('div');
    instruction.style.cssText = `
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        font-size: 0.8rem;
        color: #666;
    `;
    instruction.innerHTML = 'Place your .glb files in: <br><code>assets/models/</code><br>and update modelProjects in main.js';
    modelList.appendChild(instruction);
    
    // Add the panel to the model container
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        modelContainer.appendChild(modelList);
    }
}
