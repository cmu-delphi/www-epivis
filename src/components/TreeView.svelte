<script lang="ts">
     var self = {};
   var nextNodeID = 0;
   var Node = function(name,parent) {
      var self = {};
      // private variables
      var nodes = null;
      var dataset = null;
      var callback = null;
      var id = nextNodeID++;
      var selected = false;
      // public methods
      self.parent = parent;
      self.getID = function() { return id; };
      self.getName = function() { return name; };
      self.getNodes = function() { return nodes; };
      self.getDataset = function() { return dataset; };
      self.setNodes = function(ns) { nodes = ns; };
      self.setDataset = function(ds, cb) { dataset = ds; callback = cb; };
      self.isSelected = function() { return selected; };
      self.isLeaf = function() { return dataset !== null; };
      self.isBranch = function() { return nodes !== null; };
      self.toggleSelected = function() {
         selected = !selected;
         if(typeof callback !== "undefined" && callback !== null) {
            callback(self);
         }
      };
      self.getParent = function(){ return self.parent };
      self.getRoot = function(){
         var par = self.getParent();
         if (typeof par === "undefined")
            return self;
         else
            return par.getRoot();
      };
      return self;
   };
   var TreeView = function(containerID) {
      var self = {};
      // private variables
      var container = $("#" + containerID);
      var rootNodes = [];
      // public methods
      var append = function(node, parent) {
         parent = (typeof parent !== "undefined") ? parent : container;
         parent.append('<div id="' + getNodeID(node) + '"><span id="' + getNodeLabelID(node) + '"><i id="' + getNodeIconID(node) + '"></i> ' + node.getName() + '</span></div>');
         $("#" + getNodeLabelID(node)).click(function() {
            node.toggleSelected();
            updateNodeCSS(node);
         });
         var newParent = $("#" + getNodeID(node));
         if(node.isBranch()) {
            for(var i = 0; i < node.getNodes().length; i++) {
               append(node.getNodes()[i], newParent);
            }
         }
         updateNodeCSS(node);
         if(parent === container) {
            rootNodes.push(node);
         }
      };
      // toggles (show=undefined), shows (show=true), or hides (show=false) all tree nodes with name containing the given string (name)
      var toggleLike = function(name, show) {
         for(var i = 0; i < rootNodes.length; i++) {
            toggleNodeLike(rootNodes[i], name, (typeof show === "undefined"), (show === true));
         }
      };
      // return all datasets
      const getAllDatasets = () => getDatasets(false);
      // return all selected datasets
      const getSelectedDatasets = () => getDatasets(true);
      // return datasets
      const getDatasets = (onlySelected) => {
         const datasets = [];
         const nodenames = [];
         for(let i = 0; i < rootNodes.length; i++) {
            getDatasetsRecursive(
               datasets,
               nodenames,
               rootNodes[i].getName(),
               rootNodes[i],
               onlySelected);
         }
         return [datasets, nodenames];
      };
      // private methods
      function updateNodeCSS(node) {
         var nodeLabel = $("#" + getNodeID(node));
         var nodeIcon = $("#" + getNodeIconID(node));
         nodeLabel.removeClass();
         nodeLabel.addClass(getNodeClass(node));
         nodeIcon.removeClass();
         nodeIcon.addClass(getNodeIconClass(node));
         if(node.isBranch()) {
            for(var i = 0; i < node.getNodes().length; i++) {
               var child = $("#" + getNodeID(node.getNodes()[i]));
               if(node.isSelected()) {
                  child.show(200);
               } else {
                  child.hide(200);
               }
            }
         }
      }
      function toggleNodeLike(node, name, toggle, show) {
         if(node.getName().toLowerCase().indexOf(name.toLowerCase()) >= 0) {
            if(toggle || show !== node.isSelected()) {
               node.toggleSelected();
               updateNodeCSS(node);
            }
         }
         if(node.isBranch()) {
            for(var i = 0; i < node.getNodes().length; i++) {
               toggleNodeLike(node.getNodes()[i], name, toggle, show);
            }
         }
      }
      const toggleNode = (node) => {
         node.toggleSelected();
         updateNodeCSS(node);
      };
      const getRootNodes = () => {
         return rootNodes;
      };
      function getDatasetsRecursive(datasets, nodenames, currpath, node, onlySelected) {
         if(node.isBranch()) {
            for(var i = 0; i < node.getNodes().length; i++) {
               getDatasetsRecursive(datasets, nodenames, currpath+'/'+node.getName(), node.getNodes()[i], onlySelected);
            }
         }
         if(node.isLeaf() && (node.isSelected() || !onlySelected)) {
            datasets.push(node.getDataset());
            nodenames.push(currpath+'/'+node.getName());
         }
      }
      function getNodeID(node) {
         return "tv_node_" + node.getID();
      }
      function getNodeLabelID(node) {
         return "tv_node_label_" + node.getID();
      }
      function getNodeIconID(node) {
         return "tv_node_icon_" + node.getID();
      }
      function getNodeClass(node) {
         if(node.isLeaf()) {
            return "tv_node tv_leaf";
         } else if(node.isBranch()) {
            return "tv_node tv_branch";
         }
      }
      function getNodeIconClass(node) {
         if(node.isLeaf()) {
            if(node.isSelected()) {
               return "fa fa-check-square-o";
            } else {
               return "fa fa-square-o";
            }
         } else {
            if(node.isSelected()) {
               return "fa fa-minus-square-o";
            } else {
               return "fa fa-plus-square-o";
            }
         }
      }
      // export public methods
      self.append = append;
      self.toggleLike = toggleLike;
      self.getAllDatasets = getAllDatasets;
      self.getSelectedDatasets = getSelectedDatasets;
      self.getRootNodes = getRootNodes;
      self.toggleNode = toggleNode;
      return self;
   };
</script>

<style>
div.tv_node {
  padding: 2px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  min-width: 512px;
}
div.tv_node div.tv_node {
  margin-left: 16px;
}
div.tv_branch {
  font-weight: bold;
}
div.tv_leaf {
  font-weight: normal;
}
</style>